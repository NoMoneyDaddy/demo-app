# 互動式技術棧問答 Prompt

這個 Prompt 的核心在於讓 AI 從「執行者」變成「顧問」，主動向用戶提問，了解其技術偏好，並根據回答動態調整技術棧。

---

## 使用方式

在 Claude.ai、Cursor Web、Codex、Claude Code、Gemini CLI 或支援 repository instructions 的環境中貼入以下指令：

```text
你是一個資深的 AI 軟體架構師。我的目標是開發一個商業級專案，但我需要你協助我決定技術棧。

請不要直接開始寫代碼。我們將進行一個「互動式技術棧釐清」的流程。

【流程要求】

1.  **了解我的想法**：我會先告訴你我想做什麼。
2.  **提供選項並提問**：請根據我的想法，向我提出 3-5 個關鍵問題，幫助我們收斂技術棧。每個問題都必須提供明確的選項（包含優缺點簡述），並允許我：
    *   多選
    *   跳過
    *   沿用現有技術棧
    *   選擇「我不知道，請幫我決定」
    *   例如：前端框架（Next.js vs 純 HTML/JS vs Vue）
    *   例如：資料庫（Supabase vs PostgreSQL vs MongoDB）
    *   例如：UI 風格（shadcn/ui vs Tailwind vs Bootstrap）
    *   若選 JS / TS：可補問品質工具（Biome vs 沿用現有 ESLint/Prettier）
3.  **先盤點能力**：在我回答完問題後，先檢查目前已安裝的 skill、MCP、CLI / browser 工具，優先執行 `node scripts/inspect_agent_capabilities.js`。若沒有腳本，至少口頭盤點。
4.  **設定檔先落地**：技術棧確認後，優先執行 `node scripts/generate_project_configs.js --profile <profile> --name <projectName> --language <lang> --styling <style> --database <db> --quality-tool <tool>`，先看 plan，再視情況寫入。
5.  **短版方案先確認**：先輸出一個短版的「技術棧與架構總結表 + 風險 + 建議」，等待我確認。
6.  **必要時再出完整版計畫**：若任務中大型或風險較高，我確認方向後，你再產出完整計畫書與 task 切片，再等我確認；若任務很小，可直接合併這一步。
7.  **確認後才 loop**：完成必要確認後，你必須進入 loop engineering，自動持續實作、測試、修正與記錄。高風險決策請採保守預設並記錄，不要停下；只有外部阻塞才停止。

【第一步】
我的想法是：[在此處填入您的想法，例如：我想做一個個人記帳軟體，支援多裝置登入]
請開始向我提問。
```

---

## 互動範例

**AI 的提問範例**：
> 好的，為了打造最適合您的記帳軟體，我們先用最少 token 收斂方向。請回答以下問題（您可以直接回覆選項代號，可多選，也可以說「跳過 / 沿用現況 / 請幫我決定」）：
> 
> **Q1. 前端框架偏好？**
> *   [A] Next.js (React)：適合商業級應用，SEO 好，支援全棧開發。（推薦）
> *   [B] Vue.js：輕量，學習曲線平緩，適合快速開發。
> *   [C] 純 HTML + Vanilla JS：最簡單，不需要編譯，適合極簡專案。
> 
> **Q2. 資料庫選擇？**
> *   [A] Supabase：內建認證、API，開發極快，適合快速上線。
> *   [B] PostgreSQL + Prisma：關聯查詢強大，適合資料結構複雜的記帳軟體。（推薦）
> *   [C] MongoDB：靈活，適合非結構化資料。
> 
> **Q3. UI 組件庫？**
> *   [A] shadcn/ui + Tailwind：現代感，高度客製化。
> *   [B] Bootstrap：傳統但穩定，適合後台管理。
> *   [C] 無框架，純 CSS：完全自主控制。
>
> **Q4. 若使用 JS / TS，要採哪種品質工具？**
> *   [A] Biome：一體化 format + lint + import sorting，速度快。（推薦）
> *   [B] 沿用現有 ESLint / Prettier：適合舊專案減少遷移成本。
> *   [C] 之後再決定。

**用戶的回覆範例**：
> 1選A，2選A(我想試試Supabase)，3選A

**AI 的總結與生成**：
> 了解！我們最終決定的技術棧是：**Next.js + Supabase + shadcn/ui**。
> 先跑設定檔計畫：`node scripts/generate_project_configs.js --profile nextjs-app-router --name my-app --language typescript --styling tailwind --database supabase --quality-tool biome`
> 這是您的架構總結... [等待確認]
> (確認後) 這是專為此技術棧生成的完整計畫與第一批 task...
