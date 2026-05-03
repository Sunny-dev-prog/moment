# 抖音团购图片区圆角优化说明

## 变更范围

- 组件：`src/components/changbai-card4/ChangbaiTuanGouCarousel.tsx`
- 样式：`src/components/changbai-card4/changbai-card4-tuangou.css`
- SCSS 参数示例：`deliverables/changbai-card4-corner-tokens.scss`

## 圆角参数

- iOS 连续曲率目标半径：`16px`
- Android 降级半径：`14px`
- 应用对象：每个商品图片单元的外层壳和内部图片

## 实现策略

- 使用独立样式类 `changbai-tuangou-media-shell`
- 通过 `border-radius + overflow: hidden + clip-path` 约束容器和图片
- 补充 `-webkit-mask-image` 与 `translateZ(0)`，提升 Safari/WebKit 边缘抗锯齿表现
- 未改动图片滚动、白色左右边距和内部层级结构

## Android 兼容降级

- 默认采用 `16px` 作为 iOS/WebKit 主方案
- 在不支持 `-webkit-touch-callout` 的环境下切到 `14px`
- 保留 `border-radius` 作为基础能力，确保在 Chrome/Android WebView 中稳定退化

## 验证情况

- 已完成代码级检查与构建验证
- 已通过 `npm run build`
- 当前环境无法直接在 iOS Safari、抖音 iOS WebView 和实体 Android 设备上做真实视觉走查，因此这里不宣称已完成真机验收
- 建议补充人工复核项：
  - iPhone 设备检查 1x/2x/3x 显示边缘是否平滑
  - 抖音 iOS WebView 检查裁边与图片滚动是否正常
  - Android Chrome 检查降级半径与抗锯齿是否可接受
