# ADR-004: CI/CD And Release Gates

## Status

Accepted

## Context

主线仓库当前没有正式 CI workflow，但项目目标要求具备 development、testing、acceptance、release 的清晰生命周期。

## Decision

建立分层质量门禁：

- CI：
  - install
  - lint
  - typecheck
  - tests
  - build smoke
  - secret scanning
- CD：
  - staging build
  - manual approval
  - production release

## Alternatives Considered

### 方案 A：只保留手工 EAS 发布

优点：

- 简单

缺点：

- 不可审计，不可复制，不可作为生产流程

### 方案 B：一开始就全自动 production deploy

优点：

- 自动化程度高

缺点：

- 对当前未稳基线风险过大

## Consequences

- 先建立可信 CI，再逐步建立 CD
- release gate 会成为主线合并与发布依据

## Risks

- 初期会暴露大量既有质量问题，需要时间修复

## Follow-up Actions

- Phase B 将 workflow 正式迁入主线仓库
