# Biome Quality Loop

這份文件定義本 repo 對 JS / TS 專案的品質自動化建議。

來源基線：

- Biome 官方 README（繁中）
- Biome 官方 CLI 文件

## 何時用

- 專案包含 JavaScript / TypeScript / JSX / JSON / CSS / GraphQL
- 想把格式化、lint、import sorting、safe fix 合成一條快迴路

## 安裝

```bash
npm install --save-dev --save-exact @biomejs/biome
npx @biomejs/biome init
```

## 四條核心命令

```bash
npx @biomejs/biome format --write ./src
npx @biomejs/biome lint --write ./src
npx @biomejs/biome check --write ./src
npx @biomejs/biome ci .
```

## 何時跑哪條

- 寫完一個切片：`check --write <changed-paths>`
- 只想整理格式：`format --write <paths>`
- 只想套安全 lint 修正：`lint --write <paths>`
- CI / merge gate：`ci .`

## 推薦接法

### Build 階段

1. 最小必要修改
2. `npx @biomejs/biome check --write <changed-paths>`
3. 跑測試或最小驗證

### Review 階段

1. 先跑 `npx @biomejs/biome ci .`
2. 再做 `code-review-and-quality`

### Ship 階段

- Biome 只處理靜態品質
- 上線前仍要補 runtime 驗證、觀測與 rollback 準備

## 規則

- 預設只做 safe fix
- `--unsafe` 只在你理解副作用時才用
- Biome 不取代測試

---
