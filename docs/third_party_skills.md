# Third-party Skills

本 repo 已融合下列外部 skill，均保留上游來源與授權資訊。

## 已融合

| Local skill | Source | License | Notes |
| --- | --- | --- | --- |
| `cavekit-spec` | `JuliusBrussee/cavekit` `skills/spec` | MIT | 已本地化為 `docs/SPEC.md` 路徑 |
| `cavekit-backprop` | `JuliusBrussee/cavekit` `skills/backprop` | MIT | 已本地化為 `docs/SPEC.md` |
| `cavekit-check` | `JuliusBrussee/cavekit` `skills/check` | MIT | 已本地化為 `docs/SPEC.md` |
| `ui-ux-designer` | `sickn33/antigravity-awesome-skills` `skills/ui-ux-designer` | MIT | 保留 UI/UX / accessibility 導向 |
| `typescript-best-practices` | `shinpr/claude-code-workflows` `skills/typescript-rules` | MIT | 已裁切為 repo 通用 TypeScript 規則 |
| `text-to-lottie` | `diffusionstudio/lottie` | MIT | 保留 Lottie 動畫 prompt 與落地路由，作為可選 motion skill lane |
| `recurring-monitoring` | `Chravel-Inc/chravel-web` `skills/loop` | repo-level / mixed | 吸收 recurring watch 決策矩陣、exit policy、artifact discipline，但去除 Claude 專屬 cron 綁定 |

## 參考但未直接導入

| Candidate | Source | Reason |
| --- | --- | --- |
| `ce-work` | `EveryInc/compound-engineering-plugin` | 與現有 `loop-engineering` 重疊過高，先不內嵌 |
| `supabase-sdk-patterns` | `jeremylongshore/claude-code-plugins-plus-skills` | 壓縮包缺少 references，改由本 repo 用官方 Supabase 文檔自建 skill |
| `ponytail` | `DietrichGebert/ponytail` | 對低 token、避免 over-build 很有價值，但安裝方式依 agent 平台不同，先列為可選外掛 |

## 社群索引來源

以下站點可用來發現候選 skills，但**不是權威來源**：

- `codex-marketplace.com`
- `skillsmd.dev`
- `skillsmp.com`
- `openagentskills.dev`
- `awesomeclaude.ai`
- `awesomeskill.ai`

導入規則：

1. 先確認授權
2. 先確認 `SKILL.md` 與 references 完整
3. 先確認不與現有 workflow 重疊
4. 真正落地前，回官方文檔、Context7 或已驗證最佳實踐交叉確認

## 官方文檔支撐

- OpenAI Codex `AGENTS.md` / Skills：`developers.openai.com`
- OpenAI Plugins examples：`github.com/openai/plugins`
- Agent Skills standard：`agentskills.io`
- Supabase docs / CLI / security：`supabase.com/docs`
- TypeScript handbook / tsconfig：`typescriptlang.org`
- MDN Responsive Design：`developer.mozilla.org`
- web.dev Responsive Design：`web.dev/learn/design`
- diffusionstudio/lottie README：`github.com/diffusionstudio/lottie`
- Ponytail plugin README：`github.com/DietrichGebert/ponytail`
- mcp-cli README：`github.com/doggy8088/mcp-cli`
