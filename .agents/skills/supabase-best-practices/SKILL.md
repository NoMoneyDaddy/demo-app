---
name: supabase-best-practices
description: Apply current Supabase best practices for auth, RLS, schema changes, client/server separation, and production safety.
---

# supabase-best-practices

## 強制規則

- 公開客戶端只用 publishable / anon key，不放 `service_role`
- 暴露 schema 的 table 預設開 RLS
- schema 變更走 migration / CLI，不手改 production
