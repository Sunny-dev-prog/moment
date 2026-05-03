# 抖音团购推荐文案位置调整报告

## 变更说明

- 将 `抖音团购推荐` 从标题下方移除
- 新位置调整为：
  - 上方滑雪视频卡片下方
  - 下方团购卡片上方
  - 位于两个卡片组件之间

## 布局代码片段

```tsx
<div className="mt-3 flex flex-1 min-h-0 flex-col gap-2.5">
  <ChangbaiVideoCardSurface className="h-[51%] flex-none">
    <ChangbaiCard4VideoRow
      activeId={activeVideoId}
      softTextColor={passiveColor}
      onVideoEnd={handleVideoEnd}
    />
  </ChangbaiVideoCardSurface>

  <div
    className="flex items-center justify-start whitespace-nowrap px-1"
    style={{
      color: titleColor,
      fontSize: "calc(var(--card4-title-font-size, 25px) * 0.84)",
      fontWeight: 700,
      lineHeight: 1.2,
    }}
    aria-label="抖音团购推荐"
  >
    <span>抖音团购推荐</span>
  </div>

  <ChangbaiVideoCardSurface className="h-full">
    <ChangbaiTuanGouCarousel softTextColor={passiveColor} />
  </ChangbaiVideoCardSurface>
</div>
```

## 间距说明

- 模块容器使用 `gap-2.5`
- 对应约 `10px`
- 满足建议的 `8-12px` 间距范围

## 验证结果

- `CardFour.tsx` diagnostics 通过
- `npm run build` 通过
- 文案使用 `whitespace-nowrap`，避免换行
- 文案位于两个卡片之间，不覆盖视频播放区域

## 当前环境限制

- 当前环境无法直接输出修改前后 UI 截图
- 当前环境无法产出真机测试截图或录像
- 报告中的稳定性结论基于代码布局、构建结果和浏览器预览链路
