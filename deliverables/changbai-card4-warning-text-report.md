# 主题5卡片4提示文案替换说明

## 修改范围

- 文件：`src/components/changbai-card4/ChangbaiCard4VideoRow.tsx`
- 目标：移除视频播放器上方圆形图标中的单字文本，替换为一行提示文案

## 修改前

```tsx
<div className="flex items-center justify-between px-1">
  <span
    className="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold leading-none"
    style={{ backgroundColor: "rgba(255,255,255,0.72)", color: accentColor }}
  >
    {item.label}
  </span>
</div>
```

## 修改后

```tsx
<div className="flex h-5 items-center px-1">
  <p
    className="whitespace-nowrap text-[clamp(12px,2.4vw,14px)] font-medium leading-none"
    style={{ color: "#666666" }}
  >
    这是专业运动员，请勿直接尝试
  </p>
</div>
```

## 验证结论

- 桌面端：提示文案为单行显示，字号在 `12px - 14px` 范围内
- 移动端：文案使用 `clamp()` 响应式字号，并显式设置 `whitespace-nowrap`
- 样式：灰度文字 `#666666`，与当前浅色玻璃卡片风格一致
- 工程状态：`GetDiagnostics` 通过，`npm run build` 通过

## 当前环境限制

- 当前环境无法直接导出修改前后截图
- 如需截图交付，需要在浏览器中手动截取桌面端与移动端预览画面
