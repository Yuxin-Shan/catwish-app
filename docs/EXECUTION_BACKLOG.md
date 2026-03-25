# Execution Backlog

状态说明：

- `Todo`
- `In Progress`
- `Blocked`
- `Done`

## Todo

| ID | 标题 | Context | Acceptance Criteria | Dependencies | Risk | Status |
|---|---|---|---|---|---|---|
| CAT-011 | 将分析流程切到服务端编排 | 当前客户端直连 AI provider | analysis 已具备 server-side mock orchestration；移动端已具备 backend API feature flag 接线；剩余为真实 DB 验证与默认流量切换 | CAT-007、CAT-008、CAT-010 | High | In Progress |
| CAT-012 | 建立 observability baseline | 当前无 Sentry / analytics / structured logs | 错误、关键业务事件、API 延迟可观测 | CAT-007 | Medium | Todo |
| CAT-013 | 建立 acceptance 与 release 流程 | 当前只有文档式发布描述 | 有 staging 验收清单、release checklist、rollback 说明 | CAT-005、CAT-012 | Medium | Todo |
| CAT-014 | 建立 dependency vulnerability baseline | 安装 lint toolchain 后 `npm audit` 暴露 20 个漏洞 | 漏洞按 runtime/dev/build 分类；处置策略入文档/backlog | CAT-002 | Medium | Todo |
| CAT-016 | 建立真实数据库环境与 migration runbook | 当前 schema/migration 已有，但还未形成环境级执行路径 | development/staging DB 连接策略与 migration runbook 入仓 | CAT-008、CAT-005 | High | Todo |

## In Progress

| ID | 标题 | Context | Acceptance Criteria | Dependencies | Risk | Status |
|---|---|---|---|---|---|---|
| CAT-005 | 将 CI workflow 正式迁入主线仓库 | 当前主线仓库没有 `.github/workflows` | CI 文件已入仓，并在 GitHub 远端成功执行质量门禁 | CAT-002、CAT-003 | High | In Progress |
| CAT-006B | Golden paths 落地到后续执行 | 已有 golden paths 文档，但尚未在模板、CI、实现习惯中固化 | Bootstrap contract 已入文档，且后续 Phase B/C 按该路径继续落地 | CAT-006A | Medium | In Progress |
| CAT-006C | 工程度量机制启用 | 已有记分板文档，但尚未形成真实指标采集 | 至少对 typecheck/build/test/CI 建立真实基线更新机制 | CAT-002、CAT-005 | Medium | In Progress |
| CAT-015 | 将 backend quality gates 纳入主线 CI | backend skeleton 已建立，但若不进 CI 很快会漂移 | CI 在 GitHub 远端执行 backend `typecheck/build` | CAT-005、CAT-007 | Medium | In Progress |
| CAT-017 | 将 contracts quality gates 纳入主线 CI | contracts 若不纳入 CI，很快会与 backend/mobile 漂移 | CI 在 GitHub 远端执行 contracts `typecheck/build` | CAT-010、CAT-005 | Medium | In Progress |
| CAT-009 | 完成认证闭环 | backend auth 已具备完整路由，mobile 已具备 session storage 与 API client 基础 | 注册/登录/refresh/logout/logout-all 完成并接入真实 DB 环境；移动端形成正式登录路径 | CAT-007、CAT-008 | High | In Progress |

## Blocked

| ID | 标题 | Context | Acceptance Criteria | Dependencies | Risk | Status |
|---|---|---|---|---|---|---|
| CAT-B01 | 生产密钥历史清理 | git 历史已包含敏感信息 | 完成密钥轮换及历史治理策略 | CAT-001，需要仓库管理员操作 | Critical | Blocked |
| CAT-B03 | 本地数据库基础设施缺失 | 当前机器无 `psql` / `docker`，真实 DB 环境端到端验证受阻 | 提供可执行的本地 PostgreSQL provisioning 路径，或明确远程 dev DB 方案 | CAT-016 | High | Blocked |

## Done

| ID | 标题 | Context | Acceptance Criteria | Dependencies | Risk | Status |
|---|---|---|---|---|---|---|
| CAT-D00 | 项目转型审计与交付治理建档 | 需要以主线仓库真实状态建立长期执行结构 | `MASTER_DELIVERY_PLAN`、ADR、backlog、progress log 入仓 | 无 | Medium | Done |
| CAT-D01 | 确认主线仓库现实边界 | 需要明确 `CatWishExpo` 才是主线 git 仓库 | 已验证 git root、remote、branch、工作区状态 | 无 | Low | Done |
| CAT-D02 | 补齐平台化关键文档 | 需要让计划更贴近平台工程而非静态架构文档 | `PLATFORM_OPERATING_MODEL`、`GOLDEN_PATHS`、`ENGINEERING_SCORECARD` 入仓 | 无 | Low | Done |
| CAT-001 | 建立安全基线并移除明文密钥路径 | 当前 `.env` 与 `src/config/api.ts` 被跟踪，客户端直持第三方密钥 | 明文密钥从当前代码路径移除；`.env` 不再跟踪；历史治理转入阻塞项 | 无 | Critical | Done |
| CAT-002 | 增加标准脚本 | 当前无 `lint`、`typecheck`、`build` 脚本 | `package.json` 提供 `lint`、`typecheck`、`build:web` | CAT-001 可并行 | High | Done |
| CAT-003 | 修复 TypeScript 基线 | `npx tsc --noEmit` 失败 | `npm run typecheck` 通过 | CAT-002 | High | Done |
| CAT-004 | 修复或声明 web build 支持策略 | `expo export --platform web` 失败 | `npm run build:web` 通过，或正式声明 mobile-only 并调整 CI 策略 | CAT-002 | High | Done |
| CAT-006 | 清理生成物纳管策略 | `coverage/` 被跟踪，影响工作区与审查质量 | `coverage/` 不再被版本控制污染；生成物策略写入文档 | CAT-002 | Medium | Done |
| CAT-006A | 平台运营模型落地 | 当前治理文档已建立，但尚未形成平台服务目录与运营边界 | `PLATFORM_OPERATING_MODEL.md` 持续纳入主计划和周期复盘 | 无 | Medium | Done |
| CAT-B02 | Toolchain/bootstrap golden path 补充待确认 | 本轮发现质量门禁可能因仓库未声明工具链而失效 | `GOLDEN_PATHS.md` 已增补 bootstrap contract，并完成负责人确认 | CAT-006B | Medium | Done |
| CAT-007 | 建立 backend skeleton | 当前无服务端 | `backend/` 已可本地构建并返回 `/v1/health` | CAT-005 | High | Done |
| CAT-008 | 引入数据库 schema 与 migrations | 当前无持久化模型 | 第一批 schema 已定义，migration 已成功生成 | CAT-007 | High | Done |
| CAT-010 | 建立 API 契约与 shared contracts | 当前前后端接口未定义 | `packages/contracts` 已建立 health/auth/analysis 第一版契约 | CAT-007 | Medium | Done |
| CAT-018 | 评估并固化多包 bootstrap contract | backend 已开始消费 `packages/contracts`，需要明确 workspace/package 级构建顺序与本地开发路径 | `GOLDEN_PATHS.md` 已纳入 workspace/package bootstrap contract | CAT-010、CAT-017 | Medium | Done |
