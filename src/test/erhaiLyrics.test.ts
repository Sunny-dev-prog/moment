import { describe, expect, it, vi } from "vitest";
import {
  findActiveLyricIndex,
  getFallbackLyricLine,
  getLyricProgress,
  loadLyrics,
  parseJsonLyrics,
  parseLrcText,
  parseTimestamp,
} from "@/lib/erhaiLyrics";

describe("erhaiLyrics", () => {
  it("parses timestamps in mm:ss.xx and mm:ss formats", () => {
    expect(parseTimestamp("[01:02.34]")).toBe(62.34);
    expect(parseTimestamp("[00:07]")).toBe(7);
    expect(parseTimestamp("invalid")).toBeNull();
  });

  it("parses lrc text with multiple timestamps and plain fallback rows", () => {
    const lines = parseLrcText("[00:00.00]第一句\n[00:04][00:08]第二句\n没有时间戳");
    expect(lines).toHaveLength(4);
    expect(lines[0].text).toBe("第一句");
    expect(lines[1].time).toBe(4);
    expect(lines[2].time).toBe(8);
    expect(lines[3].text).toBe("没有时间戳");
  });

  it("returns fallback lyric for empty or broken sources", () => {
    expect(parseLrcText("")).toEqual([getFallbackLyricLine()]);
    expect(parseJsonLyrics([])).toEqual([getFallbackLyricLine()]);
  });

  it("normalizes json lyrics and timestamp strings", () => {
    const lines = parseJsonLyrics([
      { text: "小普陀", time: "00:08.00" },
      { text: "双廊古镇", time: 0 },
    ]);

    expect(lines[0].text).toBe("双廊古镇");
    expect(lines[1].time).toBe(8);
  });

  it("matches the active lyric index for playback time", () => {
    const lines = parseLrcText("[00:00]A\n[00:05]B\n[00:10]C");
    expect(findActiveLyricIndex(lines, 0)).toBe(0);
    expect(findActiveLyricIndex(lines, 4.999)).toBe(0);
    expect(findActiveLyricIndex(lines, 5.1)).toBe(1);
    expect(findActiveLyricIndex(lines, 99)).toBe(2);
  });

  it("calculates in-line lyric progress with millisecond precision", () => {
    const lines = parseLrcText("[00:00.000]A\n[00:02.500]B\n[00:05.000]C");
    expect(getLyricProgress(lines, 0, 1.25)).toBeCloseTo(0.5, 5);
    expect(getLyricProgress(lines, 1, 4.375)).toBeCloseTo(0.75, 5);
    expect(getLyricProgress(lines, 2, 6)).toBe(0);
  });

  it("loads remote json lyrics over https", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      headers: {
        get: () => "application/json",
      },
      json: async () => ({
        lines: [
          { text: "苍山雪映湖面", time: "00:04.00" },
          { text: "双廊古镇", time: "00:00.00" },
        ],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);
    const lines = await loadLyrics({ url: "https://example.com/lyrics.json" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(lines[0].text).toBe("双廊古镇");
    vi.unstubAllGlobals();
  });
});
