# 主题5卡片4按钮动画与视频播放器交付说明

## 范围

- 页面：`/theme/005?card=4`
- 按钮组件：`src/components/changbai-card4/ChangbaiCard4Actions.tsx`
- 按钮样式：`src/components/changbai-card4/changbai-card4-actions.css`
- 视频组件：`src/components/changbai-card4/ChangbaiCard4VideoRow.tsx`
- 页面接入：`src/components/CardFour.tsx`

## 已完成内容

- 为三个按钮添加持续呼吸/轻缩放/微发光动画
- 动画循环时长控制在 `1.1s - 1.8s` 区间，基础循环为 `1.6s`
- 为 `hover`、`active`、`disabled` 提供一致的动画和状态表现
- 为 `prefers-reduced-motion: reduce` 添加无动画降级
- 在固定尺寸卡片容器内接入三列横向视频播放器
- 从左到右标签顺序为：`克`、`单`、`离`
- 视频源：
  - `/card4/changbai-videos/001.mp4`
  - `/card4/changbai-videos/002.mp4`
  - `/card4/changbai-videos/003.mp4`
- 视频设置：
  - `16:9`
  - 自动播放
  - 静音
  - 循环
  - 无控件
  - 点击可触发全屏请求
- 增加加载占位和错误兜底态

## 资源处理

- 原始来源：
  - `d:/xm/zt5bc/001.mp4`
  - `d:/xm/zt5bc/002.mp4`
  - `d:/xm/zt5bc/003.mp4`
- 已复制到项目静态目录：
  - `public/card4/changbai-videos/001.mp4`
  - `public/card4/changbai-videos/002.mp4`
  - `public/card4/changbai-videos/003.mp4`

## 响应式说明

- 三视频始终横向排列，不换行
- 空间不足时按 `flex-1 + min-w-0` 等比收缩宽度
- 间距保持统一，视频保持 `16:9`

## 验证结果

- `CardFour.tsx` diagnostics 通过
- `ChangbaiCard4VideoRow.tsx` diagnostics 通过
- `changbai-card4-actions.css` diagnostics 通过
- `npm run build` 通过

## 当前限制

- 当前环境未导出桌面、平板、手机三档截图
- 点击全屏依赖浏览器安全策略，若宿主环境限制全屏请求，会保留内联播放
