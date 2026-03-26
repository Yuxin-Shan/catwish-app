# ADR-002: Authentication Strategy

## Status

Accepted

## Context

项目目标包含用户注册、登录、登出以及生产级用户系统。当前仓库完全没有用户认证能力，且现有 Expo 应用未来需要对接自有 backend API。

## Decision

采用：

- 短期 access token
- 可轮换 refresh token
- refresh token 只在服务端保存哈希
- 客户端使用 `expo-secure-store` 保存会话材料

## Alternatives Considered

### 方案 A：Cookie session

优点：

- Web 侧友好

缺点：

- 不适合作为当前 Expo 移动端主方案

### 方案 B：完全托管认证（如 Supabase Auth）

优点：

- 实现速度更快

缺点：

- 业务授权策略和账号控制被外部平台更深绑定

## Consequences

- 更适合移动端、多端扩展和未来 API 网关化
- 需要实现 token refresh、撤销、会话审计等能力

## Risks

- 自建认证复杂度高于托管方案

## Follow-up Actions

- Phase D 落地 auth schema 与 auth endpoints
