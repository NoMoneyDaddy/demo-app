# Text-to-Lottie Example

這個 example 展示本 repo 如何把動畫需求走成 skill lane。

## 何時用

- 你要 hero animation
- 你要 loader / empty state
- 你要把 SVG 路徑做 reveal animation

## 建議流程

1. 先讀 `.agents/skills/text-to-lottie/SKILL.md`
2. 準備 SVG / screenshot / brand color
3. 指定 duration、fps、easing、background
4. 產出 `lottie.json`
5. 接到 web 或 app runtime

## 上游 skill

```bash
npx skills add diffusionstudio/lottie
```

GitHub:

- `https://github.com/diffusionstudio/lottie`

## Example prompt

```text
根據這個 SVG path 做一個 2.5 秒、60 fps 的 path reveal 動畫。
風格乾淨、科技感、透明背景、ease-in-out。
另外暴露兩個 control：主色與播放速度。
輸出可重用的 lottie.json。
```
