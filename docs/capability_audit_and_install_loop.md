# Capability Audit And Install Loop

本文件定義缺能力時的安全補強流程。

調研吸收：

- `Shmayro/singularity-claude`
- `FarzamMohammadi/the-engineer`
- `FlyFission/nuclear-grade-context-engineering`

## Loop

```text
Detect gap
-> verify current capability
-> classify risk
-> choose trusted source
-> install or guide
-> verify result
-> record evidence
```

## Gap Classes

| Class | 例子 | 預設動作 |
| --- | --- | --- |
| Skill gap | 缺 repo skill | 可直接補 repo 內 skill |
| CLI gap | 缺 `gh` / `uv` / `playwright` | 先出安裝計畫 |
| MCP gap | 缺 server / connector | 先查官方文件 |
| Browser gap | 缺 extension / login | 必停確認 |
| Secret gap | 缺 token / cookie / key | 必停確認 |

## Trusted Source Order

1. repo `.agents/skills/` canonical runtime
2. repo `.claude/skills/`、`skills/` mirrors
3. repo `scripts/` / `config/`
4. 官方文件
5. 官方 package registry
6. 官方 GitHub repo

## Verification

至少一項：

- `command -v TOOL`
- `TOOL --version`
- `node scripts/inspect_agent_capabilities.js`
- 任務 smoke test

## Escalation

- 需要登入
- 需要 secret
- 找不到可信來源
- 同錯 3 次
