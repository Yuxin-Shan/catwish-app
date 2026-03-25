# Security Baseline

## 1. 当前现实与问题

已确认的高危问题：

- `.env` 已被版本控制跟踪
- `src/config/api.ts` 已被版本控制跟踪，且包含明文第三方 API key
- 客户端直连第三方 AI 服务
- 缺少 secrets handling 规范
- 缺少 secret scanning
- 缺少认证和授权体系

## 2. Immediate Controls

### 必须立即执行

- 轮换当前暴露的第三方 API key
- 停止在客户端源码中保存敏感 key
- 停止跟踪 `.env`
- 引入 `.env.example` 作为示例模板
- 在主线 CI 中加入 secrets scanning

### 下一阶段执行

- backend 代理第三方 AI 调用
- refresh token 哈希存储
- SecureStore 保存移动端 token
- rate limiting
- 审计日志

## 3. Minimum Secret Rules

- 所有生产 secrets 只允许通过环境配置注入
- 不允许将第三方服务 key 置于客户端 bundle
- `.env` 仅允许本地开发使用
- `EXPO_PUBLIC_*` 只允许非敏感公开配置

## 4. Release Blockers

以下问题不解决，不应进入生产发布：

- 明文密钥在 git 中可见
- 无认证与鉴权
- 无日志与错误追踪
- 无环境隔离
