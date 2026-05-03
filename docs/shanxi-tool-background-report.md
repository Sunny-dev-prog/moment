# 山西工具图白底处理说明

## 结论

6 张工具图的浅灰白背景可通过统一阈值去底方案处理，已输出带 Alpha 通道的 PNG，并保留工具主体边缘阴影。

## 技术方案

- 输入素材：`src/assets/card4/shanxi/tool-*.png`
- 输出素材：`src/assets/card4/shanxi/alpha-tools/*.png`
- 处理脚本：`tools/process_shanxi_assets.py`
- 核心方法：
  - 采样四角与上下边缘中心点，估算原图背景色
  - 以背景色欧氏距离建立透明度蒙版
  - 对边缘做轻量高斯羽化，避免硬切边

## 前后对比图

- 对比图：`docs/generated/shanxi-tool-background-compare.png`

## 适用性说明

- 当前 6 张工具图背景一致、主体边缘清晰，适合统一去底
- 若后续换成高反差、复杂阴影或非纯色背景素材，需要改用语义分割或手工抠图

## 结果接入

- 卡片 4 已改为使用 `alpha-tools` 目录下的透明工具图
- 同一脚本还同步生成了 `alpha-noodles`，用于面型渲染预览去除底色
