# Skill Crystallization Loop

本文件定義「做成功一次後，如何沉澱成可重用 skill」。

調研吸收：

- `lsdefine/GenericAgent`
- `Shmayro/singularity-claude`

## Trigger

符合任一條件就考慮結晶：

- 相同步驟重做 2 次以上
- 缺口補強後形成穩定流程
- 明顯可泛化到其他 repo

## Loop

```text
detect repeatable workflow
-> extract steps
-> define trigger / non-goals
-> add verification and safety notes
-> write canonical skill under .agents/skills/
-> mirror to .claude/skills/ and skills/
-> validate repo integrity
```

## Required Parts

- `name`
- `description`
- `when to use`
- `do not use when`
- `step order`
- `verification`
- `failure / stop rule`

---
