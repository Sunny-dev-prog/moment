# 山西面食渲染性能说明

## 当前实现

- 渲染方式：单张透明面型图 + 1 组 SVG 卤子叠层
- 实时计算：仅做规则匹配、少量路径参数计算与受控随机扰动
- 未使用逐帧 Canvas 重绘，也没有持续动画循环

## 本地验证范围

- 构建验证：`npm run build` 通过
- 单测验证：`npm run test -- shanxiRenderConfig` 通过
- 代码侧新增能力：
  - `src/components/shanxi-card4/shanxiRenderConfig.ts`
  - `src/components/shanxi-card4/ShanxiNoodleRenderer.tsx`
  - `src/components/shanxi-card4/shanxi-match-rules.json`

## 风险边界

- 当前环境无法直接对真机或浏览器 DevTools 做 FPS 与堆内存实测
- 因此本报告能确认的是：
  - 渲染链路不含高频重绘循环
  - 交互仅在切换面型、卤子或点击“随机微调”时触发重新计算
  - 规则计算为常数级查表 + 少量数学运算

## 结论

- 从实现结构看，这次重构对运行时压力较低，新增逻辑主要集中在一次性参数计算与静态 SVG 图层
- “帧率下降不超过 5%、内存增加不超过 20MB” 这一条，在当前环境下无法给出真机级硬证明，只能给出代码级风险评估
