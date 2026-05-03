# 阿勒泰卡片4与媒体显示修复报告

## 修复范围

- 主题4卡片4：补全两个缺失的操作功能
- 主题5卡片4：修复视频与图片显示链路
- 通用媒体链路：增强其他主题照片/视频的资源路径与兜底机制

## 根因分析

### 1. 主题4卡片4缺少实际可操作功能

- `AltayRouteCard` 之前只保留了标题、导航和一个空白面板
- 标题下方板块没有接入任何状态和点击逻辑，用户看起来就是“功能缺失”

### 2. 主题5及其他主题存在媒体路径脆弱问题

- 长白山卡片4的视频和团购图片使用了以 `/card4/...` 开头的硬编码路径
- `dataLoader.ts` 中从 `ABC.json` 映射出来的 `/total/...` 资源路径也默认依赖根路径
- 当页面运行在带部署前缀、预览路径或不同基础路径时，媒体资源容易失效

### 3. 媒体加载失败时缺少统一降级

- 卡片1的拍立得图片在资源失败时没有显式占位
- 卡片2的视频卡片在 URL 缺失时仍可点击，容易进入空播放状态
- 长白山卡片4在测试环境下会触发 `HTMLMediaElement` 未实现警告，需要测试侧 mock

## 修复内容

### 主题4卡片4

- 在 `src/components/altay-card4/AltayRouteCard.tsx` 中接入阿勒泰现有路线数据：
  - 读取 `ALTAI_ROUTE_PLANS`
  - 聚合 `ALTAI_MAP_SEGMENTS`
  - 生成两条可切换的路线操作项
- 在 `src/components/altay-card4/Theme4Card4VideoShell.tsx` 中新增真实交互：
  - `主路线 · 完整闭环`
  - `备选 · 慢返程`
- 点击不同路线后会同步切换：
  - 激活态
  - 摘要文案
  - 总里程
  - 车程

### 主题5卡片4

- 在 `src/lib/publicAsset.ts` 新增公共资源路径拼接函数 `getPublicAssetUrl()`
- 在 `src/components/changbai-card4/ChangbaiCard4VideoRow.tsx` 中：
  - 视频地址改为走公共资源路径
  - 增强 `play/pause` 安全调用
  - 增加 `loadedmetadata/canplay` 成功态联动
- 在 `src/components/changbai-card4/ChangbaiTuanGouCarousel.tsx` 中：
  - 图片地址改为走公共资源路径
  - 增加 `scrollTo` 失败时的 `scrollLeft` 回退

### 其他主题媒体兜底

- 在 `src/lib/dataLoader.ts` 中：
  - 所有 `/total/...` 媒体资源统一走 `getPublicAssetUrl()`
  - `ABC.json` 请求也统一走公共资源路径
- 在 `src/components/PhonePolaroid.tsx` 中：
  - 为拍立得图片增加加载失败占位文案 `图片待补充`
- 在 `src/components/CardTwo.tsx` 中：
  - 当视频 URL 缺失时禁用按钮
  - 显示 `视频资源暂不可用`
  - 阻止进入空白播放态

## 自动化验证

### 已通过测试

- `src/test/altayRouteCard.test.tsx`
  - 验证阿勒泰卡片4保留导航与标题
  - 验证两条路线操作存在
  - 验证点击后激活态与摘要切换生效
- `src/test/changbaiCard4Media.test.tsx`
  - 验证主题5卡片4渲染出 3 个视频节点
  - 验证团购图片区渲染出 4 张图片
  - 验证媒体地址指向正确公共资源路径
- `src/test/cardTwoMediaFallback.test.tsx`
  - 验证卡片2在缺少视频 URL 时禁用入口并显示兜底文案
- `src/test/appStartup.test.tsx`
  - 验证首页启动链路正常

### 已执行命令

```bash
npm test -- altayRouteCard.test.tsx changbaiCard4Media.test.tsx cardTwoMediaFallback.test.tsx appStartup.test.tsx
npm run build
```

### 当前结果

- 定向测试：通过
- 生产构建：通过

## 手动验证建议

### 主题4卡片4

1. 打开阿勒泰主题第4张卡片
2. 确认标题下方出现两枚路线按钮
3. 点击 `主路线 · 完整闭环`
4. 确认摘要、里程、车程对应主路线
5. 点击 `备选 · 慢返程`
6. 确认摘要、里程、车程切换为备选路线

### 主题5卡片4

1. 打开长白山主题第4张卡片
2. 确认上方视频区域出现 3 个视频位
3. 点击三个动作按钮，确认视频切换
4. 确认下方团购图片区正常轮播
5. 断网或改坏单个媒体资源时，确认界面显示错误兜底而不是整块空白

## 已知非阻塞项

- 构建仍提示 `dataLoader.ts` 同时被动态和静态导入，但不影响运行
- 当前环境无法真实完成 Safari/Firefox/Edge 真机媒体走查，本次交付以代码、测试和构建验证为主
