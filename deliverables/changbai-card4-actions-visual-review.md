# 主题5卡片4右侧按钮视觉一致性走查报告

## 范围

- 页面：`/theme/005?card=4`
- 组件：
  - `src/components/changbai-card4/ChangbaiCard4Actions.tsx`
  - `src/components/changbai-card4/changbai-card4-actions.css`
  - `src/components/CardFour.tsx`

## 变更说明

- 在三行标题文字右侧新增 3 个纵向排列按钮
- 插入位置限定在标题区域右侧，不调整页面其他结构位置
- 按钮顺序自上而下：
  - `按钮一`
  - `按钮二`
  - `按钮三`
- 按钮文案为占位符，后续可动态替换

## 结构说明

- 容器：`.changbai-card4-actions`
- 按钮：`.changbai-card4-action-button`
- 文本：`.changbai-card4-action-button__text`
- 布局方式：`flex` 纵向排列
- 接入位置：`ChangbaiPromiseCard()` 的标题 `section` 内

## 颜色策略

- 颜色来源：页面现有 `titleColor`、背景渐变色 `bgColor`
- 背景色：基于背景色提亮或压暗后生成半透明按钮底色
- 边框色：基于标题色生成
- 文字色：在亮色候选和深色候选中选择对比度更高的方案
- Hover / Active：基于按钮背景色的亮度偏移生成

## 可访问性

- 文字色选择逻辑使用对比度比较，优先选择更高对比度候选
- 按钮保留 `button` 原生语义
- 提供 `aria-label`
- `focus-visible` 有明确轮廓样式

## 响应式检查

代码级检查视口：

- 手机：窄屏下按钮宽度为 `clamp(64px, 18vw, 78px)`，文本单行省略
- 平板：按钮间距与高度按 `clamp()` 平滑过渡
- 桌面：按钮保持纵向排列，不侵入标题正文块

代码级结论：

- 标题区使用 `flex items-start justify-between gap-3`
- 标题正文块保持 `flex-1 + min-w-0 + max-w-[258px]`
- 按钮组固定为右侧列，不会挤入正文内部
- 文字超长时由省略号截断，避免换行撑高

## 已完成验证

- `CardFour.tsx` diagnostics 通过
- `ChangbaiCard4Actions.tsx` diagnostics 通过
- `changbai-card4-actions.css` diagnostics 通过
- `npm run build` 通过

## 当前环境限制

- 当前环境未直接采集桌面端、平板、手机三种截图
- 当前环境未导出视觉标尺图片
- 本报告中的视觉走查结论基于代码结构、尺寸约束、构建和页面预览逻辑

## 建议

- 若进入正式验收，建议补拍三档视口截图
- 占位按钮文案替换为真实业务文案后，再做一次长度回归检查
