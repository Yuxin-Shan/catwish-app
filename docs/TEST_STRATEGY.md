# Test Strategy

## 1. 当前现实

已存在：

- Jest
- React Native Testing Library
- 一批 screen / component / util / storage 测试

已验证：

- `npm test -- --runInBand` 通过

当前问题：

- frontend 基线已稳定，但 CI 仍待远端首轮执行验证
- backend 已有 typecheck/build/migration generate gate，但尚无 route/unit/integration tests
- 无 e2e

## 2. Target Test Pyramid

### Unit

- components
- hooks
- utils
- service methods
- backend lib / validator / service methods

### Integration

- navigation flows
- screen + service orchestration
- backend route + service + repository

### E2E

- login
- photo analyze
- result
- history

## 3. Quality Gates

最低必须：

- `lint`
- `typecheck`
- `test`
- `build:web` 或明确豁免

## 4. Acceptance Checklist

每次候选发布至少验证：

- 新用户注册/登录
- 分析成功率
- 历史记录可读写
- 表情包生成/保存
- 关键错误监控可用
- 后端健康检查通过

## 5. Immediate Work

- 在 CI 首轮执行后确认 warning policy
- 为 backend skeleton 建立 route / app 层测试结构
- 为 DB schema / migrations 增加 smoke/integration 验证路径
- 在 auth 与 DB 进入主线后补 integration test
