---
name: browser-testing-with-devtools
description: Verify frontend behavior with real browser runtime data instead of static guessing. Use for UI bugs, console errors, DOM issues, network failures, performance checks, or visual verification in web apps.
---

# browser-testing-with-devtools

不要猜畫面。看 runtime。

## 目標

- 用真實瀏覽器資料確認問題
- 把重現步驟固定下來
- 修前修後都驗證

## 工具順序

1. `agent-browser`
2. `playwright-cli`
3. 平台內建 DevTools / browser MCP

## 檢查項目

- console error
- failed network requests
- DOM 結構
- hydration / rendering 問題
- layout overflow
- interaction state

## 規則

- 沒看 runtime，不下結論
- 先保留錯誤訊息與重現步驟
- 若是純邏輯 bug，再搭配 `debugging-and-error-recovery`
