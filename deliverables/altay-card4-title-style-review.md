# 主题4卡片4标题样式走查报告

## 变更目标

- 标题文本更新为三行：
  - 从阿勒泰出发
  - 这是一条完美的
  - 驾车环线
- 字号、行高复用共享的卡片4标题规则 `theme-shared-card-title`
- 颜色通过 `getThemeTitleVars(resolvedBgColor)` 从主题4背景色自动计算对比度后生成

## 代码位置

- `src/components/altay-card4/AltayRouteCard.tsx`
- `src/index.css`

## 样式结论

- 字号：复用 `--card4-title-font-size`，默认值 `25px`
- 行高：复用 `.theme-shared-card-title` 的 `line-height: 1.24`
- 颜色：复用 `--card4-title-color`，由背景色对比度算法自动生成

## 验证结果

- 组件测试通过：标题三行文本存在
- 组件测试通过：仍仅保留顶部与底部固定导航
- 构建通过：`npm run build`

## 截图说明

- 当前环境未提供浏览器截图采集能力，因此本报告未附真实截图
- 若需最终设计交付截图，建议在本地浏览器打开主题4卡片4后补采集桌面端与手机端截图
