import "./changbai-card4-actions.css";

type ActionId = "ke" | "dan" | "li";

type ActionItem = {
  id: ActionId;
  label: string;
};

type ChangbaiCard4ActionsProps = {
  items?: [ActionItem, ActionItem, ActionItem];
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  hoverColor: string;
  activeColor: string;
  activeId: ActionId;
  onSelect: (id: ActionId) => void;
};

const DEFAULT_ITEMS: [ActionItem, ActionItem, ActionItem] = [
  { id: "ke", label: "刻刃前倾" },
  { id: "dan", label: "单脚腾空豚跳" },
  { id: "li", label: "犁式帅气刹停" },
];
const FLEX_WEIGHTS = [4, 6, 6] as const;

export function ChangbaiCard4Actions({
  items = DEFAULT_ITEMS,
  backgroundColor,
  borderColor,
  textColor,
  hoverColor,
  activeColor,
  activeId,
  onSelect,
}: ChangbaiCard4ActionsProps) {
  return (
    <div className="changbai-card4-actions" aria-label="卡片操作按钮组">
      {items.map((item, index) => (
        <button
          key={item.id}
          id={`changbai-action-${item.id}`}
          type="button"
          className="changbai-card4-action-button"
          data-active={activeId === item.id ? "true" : "false"}
          data-action-id={item.id}
          style={{
            ["--changbai-card4-action-bg" as "--changbai-card4-action-bg"]: backgroundColor,
            ["--changbai-card4-action-border" as "--changbai-card4-action-border"]: borderColor,
            ["--changbai-card4-action-text" as "--changbai-card4-action-text"]: textColor,
            ["--changbai-card4-action-hover" as "--changbai-card4-action-hover"]: hoverColor,
            ["--changbai-card4-action-active" as "--changbai-card4-action-active"]: activeColor,
            ["--changbai-card4-action-delay" as "--changbai-card4-action-delay"]: `${index * 18}ms`,
            flex: `${FLEX_WEIGHTS[index]} 1 0%`,
          }}
          aria-label={item.label}
          aria-pressed={activeId === item.id}
          onClick={() => onSelect(item.id)}
        >
          <span className="changbai-card4-action-button__text">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
