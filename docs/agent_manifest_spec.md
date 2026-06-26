# Agent Manifest Spec

本文件是 repo-level agent disclosure 草案。

調研吸收：

- `open-kya/kya-standard`
- `Fair-Grade`

## Goal

讓 agent 可機器可讀地宣告：

- 身分與版本
- 能力
- 邊界
- 需要的人類授權
- 停機條件

## Schema Version

- `schema_version`: manifest schema 版本
- 建議從 `1.0.0` 起跳
- schema major 變動時，解析端應以 major 作相容判斷

## Required Fields

- `schema_version`
- `agent_name`
- `version`
- `primary_entry`
- `supported_surfaces`
- `skills_runtime_paths`
- `autonomy_default_level`
- `allowed_actions`
- `restricted_actions`
- `requires_human_gate`
- `verification_gates`
- `audit_surfaces`
- `secret_handling`
- `kill_switch_conditions`

## Optional / Extensible Fields

- 未來可補 `maintainers`
- 未來可補 `external_integrations`
- 未來可補 `platform_constraints`

## Compatibility Rule

- minor / patch 可新增欄位，不應破壞既有必填欄位語義
- parser 應忽略未知欄位，不應直接失敗
- 若缺少必填欄位，視為 schema 不相容
- workspace mirror 應與 repo `config/agent_manifest.json` 保持同版 schema

## Current Repo Mapping

目前 machine-readable 草案落在：

- `config/agent_manifest.json`
