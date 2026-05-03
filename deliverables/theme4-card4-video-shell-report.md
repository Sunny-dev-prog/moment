# 主题4卡片4视频展示板块迁移报告

## 变更目标

- 在主题4卡片4标题下方新增仅保留容器结构的视频展示板块
- 复用主题5卡片4视频板块的视觉层级、圆角、边框、阴影、背景和占位结构
- 不渲染实际 `video`、播放按钮、控制条和播放交互
- 通过 `.theme4-card4-video` 专用类完成 1.3 倍高度放大，不影响主题5原实现

## 代码位置

- `src/components/altay-card4/Theme4Card4VideoShell.tsx`
- `src/components/altay-card4/theme4-card4-video.css`
- `src/components/altay-card4/AltayRouteCard.tsx`

## 结构说明

- 外层容器：`.theme4-card4-video`
- 玻璃卡面：`.theme4-card4-video-surface`
- 内层内容区：`.theme4-card4-video-surface-inner`
- 预览区包裹层：`.theme4-card4-video-row`
- 占位层：`.theme4-card4-video-placeholder`

## 尺寸策略

- 使用 `--theme4-card4-video-scale: 1.3`
- 使用 `--theme4-card4-video-base-height` 作为基础高度
- 实际高度：`calc(var(--theme4-card4-video-base-height) * var(--theme4-card4-video-scale))`
- 子级间距、内边距、占位点尺寸和标签字号通过同一组 CSS 变量同步放大

## 响应式断点

- 桌面：`@media (min-width: 1200px)`
- 平板：`@media (min-width: 768px) and (max-width: 1199px)`
- 手机：`@media (max-width: 767px)`

## 自动化验证

- 组件测试通过：
  - 标题存在
  - 视频容器存在
  - 无实际 `video` 元素
  - 顶部和底部导航仍保留
- 构建通过：`npm run build`

## 视觉回归说明

- 当前环境不具备 Chrome、Safari、Firefox、Edge 四浏览器自动截图和像素差异比对能力
- 因此本次未生成真实差异率数据、浏览器版本截图和时间戳图像报告
- 已完成代码级结构迁移验证、组件测试验证和生产构建验证

## 风险说明

- 主题5原视频板块主要使用 Tailwind 内联类，不存在可直接覆盖的 SCSS 源变量文件
- 本次通过新增主题4专用 CSS 变量实现等价放大，不会污染主题5组件
