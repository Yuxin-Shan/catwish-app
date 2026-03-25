# Deployment Strategy

## 1. 当前现实

- 当前只有移动端 Expo 应用
- 当前主线仓库已纳入最小可执行 CI workflow
- 当前 EAS 配置未纳管且引用缺失脚本
- 当前 backend skeleton 已入仓，但尚未建立 deployment target
- 当前数据库 schema/migration 基础已入仓，但尚未连接真实环境数据库

## 2. 目标部署结构

### Mobile

- 开发：Expo local
- Staging：EAS preview build
- Production：EAS production build

### Backend

- 开发：本地 `backend` 服务
- Staging：独立 staging 环境
- Production：独立 production 环境

### Database

- development
- test
- staging
- production

每个环境独立连接字符串和 secrets。

## 3. Recommended Deployment Path

### Phase 1

- 先让 CI 在 GitHub 远端执行成功
- 先让 mobile 质量门禁可执行
- 建立 backend skeleton 的本地启动与 typecheck 路径

### Phase 2

- 引入 backend 服务后，建立 backend staging deployment
- 将 backend quality gates 纳入 CI
- 将 migration 执行策略纳入 staging / production 发布流程
- 使用 `DATABASE_RUNBOOK.md` 作为数据库环境与迁移执行基准

### Phase 3

- 建立 production release 流程
- staging 通过验收后才允许 promote

## 4. CI Activation

当前主线 CI 文件：

- `.github/workflows/ci.yml`

当前纳入的门禁：

- bootstrap contract verification
- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm test -- --runInBand`
- `npm run build:web`
- non-blocking `npm audit`

CI 激活后必须完成的动作：

1. 在 GitHub 远端触发首轮 workflow
2. 将 workflow name 和 required checks 记录到分支保护规则
3. 确认 PR 与 push 到 `main` 都会触发
4. 确认 artifact 上传、日志保留与失败信息可读

## 5. Branch Protection Baseline

`main` 分支最低要求：

- 禁止直接 push
- 必须通过 PR 合并
- 必须开启 required status checks
- 必须要求 branch up to date before merge
- 至少 1 位 reviewer 批准
- 禁止在有 failing checks 时合并

当前建议 required checks：

- `Quality Gates`

后续 backend 纳入 CI 后增加：

- `Backend Quality Gates`

## 6. Release Gate

- CI 全绿
- staging 构建成功
- 验收清单签署完成
- 关键监控已开启
- 回滚路径已确认

## 7. Rollback

### Mobile

- 使用上一个稳定 EAS build 回滚
- 如启用 OTA，使用 channel 或 runtime version 回退

### Backend

- 保留前一版镜像 / 部署版本
- 数据库变更必须向前兼容或提供 down migration 策略

## 8. Immediate Gaps

- 主线 CI 仍需完成 GitHub 远端首轮执行验证
- 无 staging / prod secrets 管理说明
- 无版本号策略
- 无 changelog/release note 规范
- backend 尚未接入 staging / production deployment target
- 缺少数据库环境 provisioning 与 migration runbook
