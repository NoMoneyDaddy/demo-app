---
name: biome-quality-automation
description: Use Biome as the JavaScript and TypeScript quality loop for formatting, linting, import sorting, safe fixes, and CI checks. Use when the project contains JS, TS, JSX, JSON, CSS, or GraphQL and you want one fast tool to automate code review and iterative cleanup.
---

# biome-quality-automation

Biome 是 JS / TS 專案的統一 quality loop。

## 來源基線

依官方文件：

- 安裝：`npm install --save-dev --save-exact @biomejs/biome`
- 初始化：`npx @biomejs/biome init`
- 格式化：`npx @biomejs/biome format --write <paths>`
- lint 安全修正：`npx @biomejs/biome lint --write <paths>`
- 綜合檢查：`npx @biomejs/biome check --write <paths>`
- CI：`npx @biomejs/biome ci <paths>`

## 何時用

- JS / TS / JSX 專案
- 想把 format、lint、import sorting 合成一條快速迴路
- 每輪實作後需要 safe fix
- PR / CI 前需要統一品質門檻

## 推薦流程

1. 專案尚未配置：
   - `npm install --save-dev --save-exact @biomejs/biome`
   - `npx @biomejs/biome init`
2. 每個實作切片後：
   - `npx @biomejs/biome check --write <changed-paths>`
3. 只想格式化：
   - `npx @biomejs/biome format --write <paths>`
4. 只想做 lint 安全修正：
   - `npx @biomejs/biome lint --write <paths>`
5. CI / merge gate：
   - `npx @biomejs/biome ci .`

## 規則

- 預設只用安全修正
- `--unsafe` 只在你理解風險時才用
- 先針對變更路徑跑，再決定要不要全專案跑
- Biome 不是測試替代品；跑完仍要保留行為驗證
