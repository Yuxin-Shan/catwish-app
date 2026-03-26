# ADR-003: Backend Platform And Data Foundation

## Status

Accepted

## Context

当前仓库没有 backend、没有数据库、没有 migrations。项目需要最小复杂度的真实后端基础，同时保留清晰分层和长期可维护性。

## Decision

采用：

- Backend runtime: TypeScript + Hono
- Database: PostgreSQL
- Schema and migrations: Drizzle ORM

## Alternatives Considered

### 方案 A：NestJS + PostgreSQL

优点：

- 结构完整

缺点：

- 对当前项目阶段过重

### 方案 B：Supabase-only 直连

优点：

- 起步更快

缺点：

- 业务 API 边界不清晰
- 不利于后续 AI orchestration 与策略控制

## Consequences

- 可快速建立轻量但清晰的服务端分层
- 保留后续部署到多平台的自由度

## Risks

- 需要自行搭建基础 middleware、auth、logging 能力

## Follow-up Actions

- Phase C 新建 `backend/`
- 建立 health、config、logger、db 连接、migrations
