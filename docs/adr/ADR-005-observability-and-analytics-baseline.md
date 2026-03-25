# ADR-005: Observability And Analytics Baseline

## Status

Accepted

## Context

当前项目没有真正的错误追踪、日志和产品分析能力。要进入生产，需要至少具备错误可见性、关键链路度量和基础发布观测。

## Decision

采用：

- Sentry 作为错误追踪基础
- PostHog 作为产品分析基础
- backend JSON structured logs 作为日志基础

## Alternatives Considered

### 方案 A：只依赖控制台日志

优点：

- 零成本

缺点：

- 无法满足生产定位和趋势分析

### 方案 B：Datadog / New Relic 全家桶

优点：

- 能力更完整

缺点：

- 当前阶段成本和复杂度过高

## Consequences

- 可以在低复杂度下得到错误、事件、关键指标的最小闭环

## Risks

- 需要定义清晰的事件字典，避免埋点混乱

## Follow-up Actions

- Phase F 落地 mobile/backend observability
