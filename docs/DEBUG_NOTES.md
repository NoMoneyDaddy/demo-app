# DEBUG NOTES

## 2026-06-25

- 問題：repo 文件引用 `docs/ADRS.md`，但框架 repo 本身沒有這檔。
  - 處理：補上 `docs/ADRS.md`，並把 repo 自身治理文件補齊。
- 問題：`docs/architecture.md` 描述成純 Web 端雲端架構，與目前 repo 作為多 AI 治理層的定位不符。
  - 處理：改寫成 repo architecture。
- 問題：部分文件把一般技術選型與已自動化 profile 混為一談。
  - 處理：在 `docs/tech_stack_guide.md` 明確區分。
- 問題：CI 沒有檢查 skill mirror 漂移、script capability 漏登記、Markdown 本地連結失效。
  - 處理：新增 `scripts/validate_repo_integrity.js` 並接入 CI。
