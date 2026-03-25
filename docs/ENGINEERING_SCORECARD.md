# Engineering Scorecard

## 1. 目的

本记分板用于把项目转型从“主观感觉”变成“可度量进展”。

## 2. 指标分组

### Delivery

| Metric | Definition | Current Baseline | Target | Cadence |
|---|---|---|---|---|
| Deployment Frequency | 每周可发布到 staging / production 的频率 | 未建立 | 每周至少 1 次 staging | Weekly |
| Lead Time for Changes | 从代码完成到可验收构建的时间 | 未量化 | < 1 天 | Weekly |
| Change Failure Rate | 发布后需 hotfix / rollback 的比例 | 未量化 | < 15% | Monthly |
| MTTR | 生产问题平均恢复时间 | 未建立 | < 2 小时 | Monthly |

### Quality

| Metric | Definition | Current Baseline | Target | Cadence |
|---|---|---|---|---|
| Lint Pass Rate | `lint` 一次通过率 | 不存在 | > 95% | Per PR |
| Typecheck Pass Rate | `typecheck` 一次通过率 | 当前为失败 | 100% on main | Per PR |
| Test Pass Rate | 测试通过率 | 当前通过但有告警 | 100% clean or documented | Per PR |
| Build Success Rate | 构建成功率 | web build 当前失败 | > 95% | Per PR |
| Test Flake Rate | 重跑后结果不一致比例 | 未量化 | < 2% | Weekly |

### Platform / DevEx

| Metric | Definition | Current Baseline | Target | Cadence |
|---|---|---|---|---|
| New Developer Setup Time | 新成员本地跑通时间 | 未量化 | <= 30 分钟 | Monthly |
| Golden Path Coverage | 已定义标准路径覆盖的主要任务比例 | 当前 0% | > 80% | Monthly |
| Manual Steps Per Release | 每次发布需人工执行的关键步骤数 | 未量化 | 持续下降 | Monthly |
| Docs Freshness | 核心文档最近更新是否落后于现实 | 当前部分失真 | 核心文档每周期更新 | Weekly |

### Productization

| Metric | Definition | Current Baseline | Target | Cadence |
|---|---|---|---|---|
| Mock Replacement Progress | 核心流程从 mock 到 real 的替换比例 | 较低 | 持续上升 | Bi-weekly |
| Auth Readiness | 用户系统落地进度 | 0% | Phase D 完成 | Bi-weekly |
| Backend Coverage | 核心业务是否有真实 backend 承载 | 0% | Phase E 完成 | Bi-weekly |

### Reliability / Observability

| Metric | Definition | Current Baseline | Target | Cadence |
|---|---|---|---|---|
| Error Visibility | 关键错误是否进入可追踪系统 | 无 | 100% critical path tracked | Weekly |
| Analysis Success Rate | 分析请求成功率 | 未建立 | > 95% | Weekly |
| AI Fallback Rate | 真实 AI 回退到 mock 的比例 | 未建立 | 持续下降 | Weekly |
| Release Observation Completion | 发布后是否完成观察清单 | 无 | 100% | Per Release |

## 3. 当前已知基线

基于已验证状态：

- `npm test -- --runInBand`：通过
- `npx tsc --noEmit`：失败
- `npx expo export --platform web`：失败
- 主线仓库无正式 CI
- 主线仓库无 backend
- 主线仓库已存在安全基线问题

## 4. Scorecard Usage Rules

- 不以“文档声称”填充基线，只以实际命令和实际系统状态填充
- 每次重要工作周期后更新一次
- 当指标无法测量时，必须明确写 `未建立`
- 指标不是为了装饰，而是用于调整优先级

## 5. 当前季度重点指标

近期优先关注：

- Typecheck Pass Rate
- Build Success Rate
- Golden Path Coverage
- Mock Replacement Progress
- Error Visibility

## 6. Next Actions

- 在 Phase A 完成后首次更新真实指标值
- 在 CI 入仓后开始收集 pass rate
- 在 backend 上线后收集 API 与 analysis 指标
