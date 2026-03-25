# Platform Operating Model

## 1. 目的

本文件用于把当前项目的工程转型，从“架构规划”升级为“平台产品化运营”。

核心目标：

- 把交付能力当作内部平台产品经营
- 把开发者当作平台用户，而不是默认会自行拼装流程
- 让正确路径成为最低摩擦路径

## 2. 平台服务对象

当前阶段的主要平台用户：

### Mobile Developer

主要需求：

- 一条清晰的本地启动路径
- 稳定的环境配置
- 明确的 API 契约
- 快速知道当前功能是 real / mock / deferred

### Backend Developer

主要需求：

- 清晰的目录分层
- 可重复的 migration 与本地数据库初始化
- 稳定的 contract 与错误模型

### QA / Acceptance Owner

主要需求：

- 可执行的验收清单
- staging 环境
- 与发布版本一一对应的构建产物

### Release / Delivery Owner

主要需求：

- 可追踪的发布闸口
- 风险与 blocker 可视化
- 发布后可观测性和回滚路径

## 3. 平台职责边界

平台负责：

- 开发、测试、验收、发布的标准路径
- 统一质量门禁
- 环境配置与 secrets 约束
- API 契约与 shared contracts
- backend skeleton 与基础服务能力
- 可观测性与发布后监控基线

平台不负责：

- 代替产品定义业务优先级
- 为每个实验功能提供定制流水线
- 让不符合规范的快速试验直接进入生产路径

## 4. 平台产品原则

### Product-first

平台文档、脚本、workflow、模板都应以“降低团队认知负担”为目标。

### Golden-path-first

优先提供一条被推荐、被验证、被文档化的标准路径，再考虑例外路径。

### Self-service with guardrails

允许团队自主推进，但必须在质量与安全边界内完成。

### Day 1 + Day 2

不仅关注开发和发布，也关注运行、告警、恢复和持续优化。

### Measurable DevEx

平台不是“感觉更好了”，而是要通过指标验证交付体验是否改善。

## 5. 当前平台产品清单

### 已有

- 主交付计划
- ADR 体系
- execution backlog
- progress log
- 测试基础
- golden paths 初版
- 工程度量记分板初版

### 正在建设

- 标准脚本基线
- CI 质量门禁
- backend foundation
- auth / DB / contracts

### 缺失

- 平台 onboarding 文档
- runbooks
- 自助脚手架或模板

## 6. 平台服务目录 v1

平台在近期应向团队提供以下自助能力：

### 开发

- 本地一键启动路径
- 环境变量模板
- mock/real feature matrix

### 质量

- `lint`
- `typecheck`
- `test`
- `build`

### 后端

- backend template
- route / service / repository 标准
- migration template

### 交付

- PR 检查
- staging build
- release checklist
- rollback runbook

## 7. 平台 SLO / 非功能目标 v1

### 开发体验目标

- 本地新成员完成启动时间 <= 30 分钟
- 标准功能开发路径无需额外口头解释

### 质量目标

- 主线必须有可执行 CI
- main 分支禁止绕过核心质量门禁

### 运行目标

- 发布后关键错误可在 15 分钟内发现
- 回滚动作具备文档化流程

## 8. 平台运营节奏

### 每个工作周期必须更新

- `MASTER_DELIVERY_PLAN`
- `EXECUTION_BACKLOG`
- `PROGRESS_LOG`

### 每阶段必须复盘

- 哪些摩擦被移除
- 哪些路径仍依赖人工解释
- 哪些质量门禁仍不稳定

## 9. Immediate Follow-ups

- 将 `GOLDEN_PATHS.md` 接入后续 Phase A/B/C 的真实执行
- 将 `ENGINEERING_SCORECARD.md` 从静态文档升级为持续更新的指标面板
- 在 Phase A 完成后，为 CI 与 backend 增加模板化路径
