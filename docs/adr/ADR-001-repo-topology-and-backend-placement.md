# ADR-001: Repo Topology And Backend Placement

## Status

Accepted

## Context

当前主线仓库只有 Expo 移动端，且代码、文档、交付配置混杂。用户要求在现有项目基础上建立生产导向的完整工程结构，包括 backend foundation、CI/CD、交付治理与长期可维护文档。

## Decision

采用单仓库增量演进策略：

- 保持当前 Expo 应用暂时位于仓库根目录
- 在同一仓库中新增：
  - `backend/`
  - `packages/contracts/`
  - `docs/`
- 暂不在第一阶段将移动端强制迁移到 `apps/mobile/`

## Alternatives Considered

### 方案 A：立即重构为严格 monorepo

优点：

- 目录结构更整洁

缺点：

- 当前基线未稳，立即搬迁目录 blast radius 高

### 方案 B：拆分为独立 mobile repo + backend repo

优点：

- 服务边界清晰

缺点：

- 对当前团队体量过重
- 会增加 CI/CD、版本协同和规划维护成本

## Consequences

- 允许以较低风险先建立 backend 和 CI/CD
- 后续仍保留向更标准 monorepo 迁移的空间

## Risks

- 根目录在一段时间内仍然不够整洁

## Follow-up Actions

- Phase C 开始新增 `backend/`
- Phase E 评估是否需要将 mobile 迁移到 `apps/mobile/`
