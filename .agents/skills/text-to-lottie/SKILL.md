---
name: text-to-lottie
description: Generate or refine production-ready Lottie animations for web and app UI work. Use when a task needs motion graphics, animated SVG reveals, onboarding loops, loaders, hero motion, or reusable animation JSON.
---

# text-to-lottie

上游靈感來自 `diffusionstudio/lottie`。

適用情境：

- 網站 hero animation
- loading / empty-state animation
- onboarding / feature reveal
- SVG path reveal animation
- 需要輸出可重用 `lottie.json`

## 核心原則

- 先有具體資產，再做動畫
- 先說清楚時長、fps、節奏，再談風格
- 動畫要服務資訊，不是純裝飾
- 能用 `Lottie JSON` 表達，就不要綁死單一平台 runtime

## 推薦輸入

- SVG
- 截圖
- 品牌色
- 動畫時長
- fps
- easing
- 背景是否透明

## Prompt 要點

- 指出動畫目標：reveal / pulse / morph / loop / transition
- 指出節奏：ease-in / ease-out / ease-in-out / spring-like
- 指出鏡頭感：push / pan / zoom / parallax
- 指出可調控制項：背景色、主色、速度、透明度
- 指出輸出限制：檔案大小、總幀數、是否可循環

## 與其他 skill 的搭配

- 視覺方向：`ui-ux-designer`
- 網站落地：`website-best-practices`
- 前端實作：`frontend-ui-engineering`
- 響應式檢查：`responsive-design-best-practices`

## 建議流程

1. 先釐清動畫用途與平台
2. 準備 SVG / screenshot / brand tokens
3. 先產一版低風險 motion concept
4. 再調整 timing、loop、background、controls
5. 最後把輸出接到 web / mobile runtime

## 上游安裝方式

若 agent 平台支援 skills installer，可用上游 quick start：

```bash
npx skills add diffusionstudio/lottie
```

之後要求 agent 使用 `text-to-lottie` 產出動畫。

## 平台落地提醒

- Web：輸出 `animation.json`，接對應 Lottie player
- React Native：接 `lottie-react-native`
- iOS / Android / Flutter：接各自 Lottie runtime

## 本 repo 的定位

本 skill 在本 repo 內先扮演「路由與 prompt 紀律」角色。
若未來要更深整合，可再補：

- animation asset pipeline
- scene naming convention
- animation review checklist
- bundle size gate
