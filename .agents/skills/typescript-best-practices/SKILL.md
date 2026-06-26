---
name: typescript-best-practices
description: Apply TypeScript best practices for strict mode, safe narrowing, tsconfig safety, robust error handling.
---

# typescript-best-practices

## 核心原則

- `strict: true`
- 禁用無意義的 `any`
- 外部輸入先當 `unknown`
- 用 narrowing、discriminated unions、type guards 收斂型別
