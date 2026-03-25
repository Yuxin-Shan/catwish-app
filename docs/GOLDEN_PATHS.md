# Golden Paths

## 1. 目的

Golden path 不是“唯一可行路径”，而是团队被推荐、被支持、被验证的最低摩擦路径。

本文件定义 CatWish 当前转型阶段的标准执行路径。

## 2. Bootstrap Contract - toolchain / environment 必须先验证

适用场景：

- 首次进入仓库
- 新增 CI job
- 新成员 onboarding
- 新增质量门禁
- 任何需要执行 `lint` / `typecheck` / `test` / `build` 的工作周期

标准步骤：

1. 验证 `package.json` 中已正式声明需要执行的脚本
2. 验证 `package-lock.json` 或等价锁文件存在且与主线一致
3. 验证质量门禁依赖已被仓库正式声明，而不是依赖本机全局工具
4. 验证关键配置文件存在且与脚本匹配，例如 `tsconfig.json`、`jest.config.js`、`eslint.config.js`
5. 验证环境变量 contract 明确：哪些变量是本地可选、哪些变量是 CI 必填、哪些变量禁止进入客户端
6. 只有在 bootstrap contract 通过后，才执行 `lint`、`typecheck`、`test`、`build`

验收标准：

- 质量门禁是“仓库能力”，不是“开发者机器能力”
- CI 与本地执行路径一致
- 没有未声明的全局依赖
- 环境注入边界明确，不依赖隐式 `.env`

## 3. Workspace / Package Bootstrap Contract

适用场景：

- 仓库开始出现多个可独立构建的 package
- backend 开始消费 shared contracts
- CI 需要在多个 package 之间建立构建顺序
- 新增 `packages/*`、`backend/`、未来 `apps/*` 模块

标准步骤：

1. 明确 package 的职责边界，以及它被谁消费
2. 为每个 package 提供独立的 `package.json`、锁文件、`tsconfig.json` 和最小脚本
3. 明确构建顺序，例如 `contracts -> backend -> app`
4. 在 CI 中显式安装和构建上游 package，而不是隐式依赖本地产物
5. 在主计划或 backlog 中登记 package 之间的依赖关系
6. 只有在 workspace/package bootstrap contract 通过后，才把新 package 纳入主线开发路径

验收标准：

- 多包依赖顺序明确
- CI 不依赖“上一次本地 build 产物”
- 每个 package 都有可独立验证的 `typecheck/build`
- shared package 的升级不会悄悄破坏下游模块

## 4. Path A - 新增前端功能模块

适用场景：

- 新 screen
- 新 feature flow
- 新的 UI/交互能力

标准步骤：

1. 在 `EXECUTION_BACKLOG` 中登记任务
2. 明确功能属于 `real` / `mock` / `deferred`
3. 在 `src/features/<feature>` 或现有模块中新增代码
4. 补充 shared type / navigation / service contract
5. 增加测试
6. 通过 `lint`、`typecheck`、`test`
7. 更新相关文档与进展日志

验收标准：

- 功能边界明确
- 没有把 mock 伪装成 real
- 关键交互有测试
- 不引入新的未文档化环境依赖

## 5. Path B - 新增后端 API Endpoint

适用场景：

- 新业务 API
- 新资源接口
- 新 auth endpoint

标准步骤：

1. 在 `API_SPEC.md` 中登记或更新接口契约
2. 在 `packages/contracts` 定义共享类型
3. 实现 route/controller/service/repository
4. 增加 input validation 和统一 error mapping
5. 增加单元/集成测试
6. 通过 backend build/test
7. 更新 `PROGRESS_LOG`

验收标准：

- API 契约先于实现
- 错误响应符合统一 envelope
- 路由层不直接承载业务逻辑

## 6. Path C - 新增数据库迁移

适用场景：

- 新表
- 新字段
- 索引变更
- auth/session schema

标准步骤：

1. 在 ADR 或 backlog 中记录变更原因
2. 更新 schema 定义
3. 生成 migration
4. 评估向前兼容性与回滚策略
5. 在本地 / test 环境执行 migration
6. 更新 API contract 或 repository

验收标准：

- migration 可重复执行
- 生产变更具备风险说明
- 破坏性变更必须经过显式批准

## 7. Path D - 发布一个版本

适用场景：

- staging 验收版本
- production release

标准步骤：

1. CI 全绿
2. 当前 release checklist 完整
3. 构建产物与 git commit 对应
4. staging 验收通过
5. 发布批准
6. 生产发布
7. 发布后 24h 观察
8. 更新 `PROGRESS_LOG` / 发布记录

验收标准：

- 可回溯到 commit
- 可证明经过验证
- 发布后有观测动作

## 8. Path E - 替换一个 Mock 流程

适用场景：

- 拍照
- AI 分析
- 历史云同步
- 用户系统

标准步骤：

1. 在主计划中标记当前 mock 边界
2. 定义真实依赖与契约
3. 在 backend 或 native capability 中提供真实实现
4. 保留短期 fallback 策略
5. 增加指标以观测 mock->real 替换效果

验收标准：

- mock 被显式移除或降级为 fallback
- 不再依赖未受控客户端密钥
- 替换过程可观测

## 9. Anti-patterns

以下做法应避免：

- 未验证 toolchain/bootstrap contract 就开始跑质量门禁
- 在多包仓库里依赖未声明的上游 build 产物
- 先写实现，后补 API 契约
- 用 README 描述完成，代替实际质量门禁
- 把生成物、覆盖率报告、临时脚本长期纳入主线
- 在客户端继续新增敏感密钥依赖
- 未说明 real/mock 状态就合并功能

## 10. 当前需要优先稳定的 Golden Paths

- toolchain / bootstrap contract
- workspace / package bootstrap contract
- 前端功能模块开发路径
- 标准质量检查路径
- backend endpoint 新增路径
- 版本发布路径
