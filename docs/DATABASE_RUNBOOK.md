# Database Runbook

## 1. 当前状态

- backend 已使用 Drizzle + PostgreSQL 建立 schema 基线
- 第一版 migration 已生成到 `backend/drizzle/`
- 当前尚未连接真实 development / staging / production 数据库

## 2. 环境约定

### Development

- 目标：本地开发与 schema 验证
- 连接：本地 PostgreSQL 或本地容器 PostgreSQL
- 环境变量：
  - `DATABASE_URL`
  - `DATABASE_SSL=false`

建议连接串：

`postgresql://postgres:postgres@localhost:5432/catwish`

### Test

- 目标：integration test / migration smoke test
- 连接：独立 test DB，禁止与 development 共用
- 要求：
  - 可反复重建
  - migration 可重复执行

### Staging

- 目标：发布前验收
- 要求：
  - 与 production 拓扑尽量一致
  - secrets 仅通过 CI / deployment platform 注入
  - migration 必须先在 staging 成功

### Production

- 目标：正式业务数据
- 要求：
  - 禁止手工修改 schema
  - 所有变更必须来源于 migration
  - migration 执行需要发布记录与回滚说明

## 3. Required Environment Variables

- `DATABASE_URL`
- `DATABASE_SSL`

后续 auth 阶段追加：

- `JWT_ACCESS_TOKEN_SECRET`
- `JWT_REFRESH_TOKEN_SECRET`

## 4. Standard Commands

在 `backend/` 目录执行：

- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:studio`

## 5. Standard Flow

### 新增 schema 变更

1. 修改 `src/db/schema.ts`
2. 运行 `npm run db:generate`
3. 审查生成的 SQL migration
4. 在 development / test DB 执行 migration
5. 更新相关 API contract / repository / service
6. 将变更记录到 `PROGRESS_LOG`

### 发布前 migration 流程

1. 确认 CI 全绿
2. 确认 migration 已在 staging 验证
3. 确认变更具备向前兼容性或明确回滚策略
4. 在发布记录中登记 migration 文件名
5. 生产执行 migration 后再开放新功能流量

## 6. Review Checklist

- 是否引入了破坏性 schema 变更
- 是否补充了索引与唯一约束
- 是否影响 auth / analysis / history 的既有数据路径
- 是否需要 backfill
- 是否已记录 rollback 方案

## 7. Rollback Guidance

- 优先使用向前兼容迁移，避免依赖 destructive down migration
- 对删除列、重命名列、语义变更列，采用两阶段迁移：
  - 先新增兼容结构
  - 再迁移代码
  - 最后移除旧结构
- 如果 migration 已在 production 执行且涉及数据变更，回滚必须配合数据恢复策略，不应只依赖 SQL down

## 8. Immediate Next Steps

- 建 development / test PostgreSQL provisioning 方案
- 在 CI 中增加 migration generate / migrate smoke path
- 将 auth DTO 与 shared contracts 对齐到现有 schema
