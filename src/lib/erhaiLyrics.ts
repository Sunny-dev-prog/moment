export type LyricLine = {
  key: string;
  text: string;
  time: number;
};

export type JsonLyricLine = {
  key?: string;
  text?: string;
  time?: number | string;
};

export type LyricSource =
  | string
  | LyricLine[]
  | {
      url?: string;
      text?: string;
      lines?: JsonLyricLine[];
    };

const FALLBACK_LINE: LyricLine = {
  key: "erhai.lyrics.empty",
  text: "暂无歌词",
  time: 0,
};

const TIMESTAMP_RE = /\[(\d{2}):(\d{2})(?:\.(\d{1,3}))?\]/g;

export function parseTimestamp(token: string): number | null {
  const match = token.match(/\[(\d{2}):(\d{2})(?:\.(\d{1,3}))?\]/);
  if (!match) return null;

  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  const fractionRaw = match[3] ?? "0";

  if (Number.isNaN(minutes) || Number.isNaN(seconds)) return null;

  const fraction =
    fractionRaw.length === 1
      ? Number(fractionRaw) * 100
      : fractionRaw.length === 2
        ? Number(fractionRaw) * 10
        : Number(fractionRaw.slice(0, 3));

  return minutes * 60 + seconds + fraction / 1000;
}

export function sanitizeLyricText(text: string): string {
  return text.replace(/\uFEFF/g, "").replace(/\r/g, "").replace(/\uFFFD/g, "").trim();
}

export function normalizeLyricLines(lines: LyricLine[]): LyricLine[] {
  const normalized = lines
    .map((line, index) => ({
      key: line.key || `lyric-${index}`,
      text: sanitizeLyricText(line.text),
      time: Number.isFinite(line.time) ? Math.max(0, line.time) : index * 3,
    }))
    .filter((line) => line.text.length > 0)
    .sort((a, b) => a.time - b.time || a.key.localeCompare(b.key));

  return normalized.length > 0 ? normalized : [FALLBACK_LINE];
}

export function parseLrcText(source: string): LyricLine[] {
  const text = sanitizeLyricText(source);
  if (!text) return [FALLBACK_LINE];

  const rows = text.split("\n");
  const parsed: LyricLine[] = [];

  rows.forEach((row, rowIndex) => {
    const timestamps = [...row.matchAll(TIMESTAMP_RE)];
    const content = sanitizeLyricText(row.replace(TIMESTAMP_RE, ""));

    if (timestamps.length === 0) {
      if (content) {
        parsed.push({
          key: `plain-${rowIndex}`,
          text: content,
          time: parsed.length > 0 ? parsed[parsed.length - 1].time + 3 : rowIndex * 3,
        });
      }
      return;
    }

    timestamps.forEach((timestamp, timestampIndex) => {
      const token = timestamp[0];
      const time = parseTimestamp(token);
      if (time === null) return;
      parsed.push({
        key: `lrc-${rowIndex}-${timestampIndex}`,
        text: content || FALLBACK_LINE.text,
        time,
      });
    });
  });

  return normalizeLyricLines(parsed);
}

export function parseJsonLyrics(lines: JsonLyricLine[]): LyricLine[] {
  if (!Array.isArray(lines) || lines.length === 0) return [FALLBACK_LINE];

  const parsed = lines.map((line, index) => {
    const time =
      typeof line.time === "string"
        ? parseTimestamp(`[${line.time.replace(/^\[|\]$/g, "")}]`) ?? index * 3
        : typeof line.time === "number"
          ? line.time
          : index * 3;

    return {
      key: line.key || `json-${index}`,
      text: line.text || FALLBACK_LINE.text,
      time,
    };
  });

  return normalizeLyricLines(parsed);
}

export async function loadLyrics(source: LyricSource): Promise<LyricLine[]> {
  if (Array.isArray(source)) return normalizeLyricLines(source);

  if (typeof source === "string") {
    if (/^https:\/\//i.test(source)) {
      const response = await fetch(source);
      const body = await response.text();
      return parseLrcText(body);
    }
    return parseLrcText(source);
  }

  if (source.url) {
    const response = await fetch(source.url);
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const payload = await response.json();
      return parseJsonLyrics(Array.isArray(payload) ? payload : payload?.lines ?? []);
    }

    return parseLrcText(await response.text());
  }

  if (source.text) return parseLrcText(source.text);
  if (source.lines) return parseJsonLyrics(source.lines);
  return [FALLBACK_LINE];
}

export function findActiveLyricIndex(lines: LyricLine[], currentTime: number): number {
  if (!lines.length) return 0;
  if (currentTime <= lines[0].time) return 0;

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (currentTime >= lines[index].time) return index;
  }

  return 0;
}

export function getLyricProgress(lines: LyricLine[], activeIndex: number, currentTime: number): number {
  if (!lines.length || activeIndex < 0 || activeIndex >= lines.length) return 0;

  const currentLine = lines[activeIndex];
  const nextLine = lines[activeIndex + 1];
  if (!nextLine) return 0;

  const duration = nextLine.time - currentLine.time;
  if (duration <= 0) return 1;

  const progress = (currentTime - currentLine.time) / duration;
  return Math.max(0, Math.min(progress, 1));
}

export function getFallbackLyricLine(): LyricLine {
  return FALLBACK_LINE;
}
