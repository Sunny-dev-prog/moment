export type ErhaiLine = {
  key: string;
  text: string;
};

export type ErhaiTimedLine = ErhaiLine & {
  timeTag: string;
};

export const ERHAI_TIMED_LINES: ErhaiTimedLine[] = [
  { key: "erhai.arrival.shuanglang", text: "前方到达双廊古镇", timeTag: "00:00.00" },
  { key: "erhai.arrival.cangshan-snow", text: "即将看见苍山雪映湖面", timeTag: "00:04.00" },
  { key: "erhai.arrival.xiaoputuo", text: "前方到达小普陀", timeTag: "00:08.00" },
  { key: "erhai.arrival.red-gulls", text: "即将遇见红嘴鸥划过天际", timeTag: "00:12.00" },
  { key: "erhai.arrival.haishe", text: "前方到达海舌公园", timeTag: "00:16.00" },
  { key: "erhai.arrival.sunset", text: "即将邂逅落日洒满海西", timeTag: "00:20.00" },
  { key: "erhai.arrival.xizhou", text: "前方到达喜洲稻田", timeTag: "00:24.00" },
  { key: "erhai.arrival.moonrise", text: "即将看见洱海月升上夜空", timeTag: "00:28.00" },
];

export const ERHAI_LINES: ErhaiLine[] = ERHAI_TIMED_LINES.map(({ key, text }) => ({ key, text }));

export const ERHAI_LRC_TEXT = ERHAI_TIMED_LINES.map((line) => `[${line.timeTag}]${line.text}`).join("\n");

export const ERHAI_LYRICS_JSON = {
  lines: ERHAI_TIMED_LINES.map((line) => ({
    key: line.key,
    text: line.text,
    time: line.timeTag,
  })),
};
