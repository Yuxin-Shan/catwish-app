# API Spec Draft

当前状态：

- 主线仓库已具备 backend skeleton 与数据库 schema/migration 基础
- 本文档为第一版目标 API 契约草案，用于驱动 backend skeleton 与前后端解耦

## 1. API Principles

- Base path: `/v1`
- Transport: HTTPS + JSON
- Auth: `Authorization: Bearer <access_token>`
- Errors: 统一 error envelope
- Request tracing: `x-request-id`

## 2. Response Convention

### Success

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": null
  }
}
```

## 3. Planned Endpoints

### Health

- `GET /v1/health`
- `GET /v1/version`

### Auth

- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/refresh`
- `POST /v1/auth/logout`
- `POST /v1/auth/logout-all`

当前实现状态：

- 已落地：
  - `POST /v1/auth/register`
  - `POST /v1/auth/login`
  - `POST /v1/auth/refresh`
  - `POST /v1/auth/logout`
  - `POST /v1/auth/logout-all`

### User

- `GET /v1/me`
- `PATCH /v1/me`

### Pet Profile

- `GET /v1/pets`
- `POST /v1/pets`
- `PATCH /v1/pets/:petId`

### Analysis

- `POST /v1/analysis`
- `GET /v1/analysis`
- `GET /v1/analysis/:analysisId`
- `DELETE /v1/analysis/:analysisId`

当前实现状态：

- 已落地：
  - `POST /v1/analysis`
  - `GET /v1/analysis`
  - `GET /v1/analysis/:analysisId`
- 当前行为：
  - `POST /v1/analysis` 会创建一条服务端 analysis request 记录，并由 backend 触发 provider orchestration
  - 当前默认 provider 为 server-side mock，成功时会返回 `completed` 结果并持久化到数据库
  - `GET /v1/analysis` 会返回最近 analysis requests 列表，并在存在结果记录时携带 result payload
  - `GET /v1/analysis/:analysisId` 会返回单条 analysis 详情
  - 异步任务队列、真实第三方 provider 接入与客户端替换仍属于后续阶段

### Memes

- `POST /v1/memes`
- `GET /v1/memes/:memeId`

### Events

- `POST /v1/events`

## 4. Initial Analysis Flow

### Request

`POST /v1/analysis`

```json
{
  "petId": "optional-pet-id",
  "imageUploadId": "file-id",
  "source": "camera"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "analysisId": "ana_123",
    "status": "completed",
    "source": "camera",
    "requestedAt": "2026-03-26T10:00:00.000Z",
    "result": {
      "emotion": "😊开心",
      "emotionScore": 85,
      "catSays": "喵~今天感觉超好的!",
      "behaviorAnalysis": "猫咪看起来很放松",
      "interactionSuggestion": "可以陪它玩一会儿",
      "memeText": "好开心~",
      "memeCategory": "撒娇"
    }
  }
}
```

## 5. Status

- `Draft`
- backend skeleton 已先行落地 `/v1/health` 与 `/v1/version`
- Drizzle schema 与第一版 migration 已生成
- auth route/service/repository 第一版已入仓
- backend auth 已开始消费 shared contracts
- analysis route/service/repository skeleton 已入仓
- 仍需在真实 DB 环境下完成 auth 端到端验证
