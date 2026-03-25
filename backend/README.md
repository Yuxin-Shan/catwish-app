# CatWish Backend

当前目录是 CatWish 的 backend skeleton。

已提供：

- Hono + Node server 基础运行时
- `/v1/health`
- `/v1/version`
- 统一 success / error envelope
- request id middleware
- basic structured logger
- 环境变量 schema
- Drizzle + PostgreSQL schema/migration 基础

本阶段目标是先建立可运行骨架，后续再逐步补齐：

- auth
- database
- migrations
- contracts
- observability integrations

## Database Commands

- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:studio`
