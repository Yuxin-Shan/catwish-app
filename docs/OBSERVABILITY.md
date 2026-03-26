# Observability Plan

## 1. 当前现实

当前几乎没有真正可用的可观测性：

- 无 Sentry
- 无产品分析平台
- 无服务端结构化日志
- 无监控告警
- `storageService.recordUsage` 只是本地 AsyncStorage 计数，不构成真正 analytics

## 2. Recommended Baseline

### Error Tracking

- Mobile: Sentry
- Backend: Sentry

### Product Analytics

- PostHog Cloud

### Logging

- Backend JSON structured logs
- 字段至少包含：
  - `timestamp`
  - `level`
  - `requestId`
  - `userId`
  - `route`
  - `latencyMs`
  - `errorCode`

### Metrics

- auth_login_success_rate
- analysis_success_rate
- analysis_latency_p95
- ai_fallback_to_mock_rate
- meme_generation_success_rate
- history_sync_success_rate

## 3. Event List v1

- `app_opened`
- `auth_registered`
- `auth_logged_in`
- `analysis_started`
- `analysis_completed`
- `analysis_failed`
- `meme_generation_started`
- `meme_generation_completed`
- `meme_saved`
- `history_viewed`

## 4. Immediate Gaps

- 先建立事件字典
- 后续随着 backend 上线，将关键事件上送到服务端或 analytics SDK
