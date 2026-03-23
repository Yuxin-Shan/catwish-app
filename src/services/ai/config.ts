// src/services/ai/config.ts
/**
 * AI服务配置
 * 支持运行时切换AI提供者
 */

import { AIConfig } from './types';

/**
 * AI服务默认配置
 */
export const DEFAULT_AI_CONFIG: AIConfig = {
  // 当前使用的提供者 (可通过环境变量覆盖)
  currentProvider: (process.env.AI_PROVIDER as any) || 'mock',

  // Claude 3.5 Sonnet配置
  claude: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
    apiUrl: 'https://api.anthropic.com/v1/messages'
  },

  // GPT-4V备用配置
  gpt4v: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4-vision-preview',
    maxTokens: 1024,
    apiUrl: 'https://api.openai.com/v1/chat/completions'
  },

  // 自定义模型配置 (V2.0)
  custom: {
    apiUrl: process.env.CUSTOM_AI_URL || '',
    apiKey: process.env.CUSTOM_AI_KEY,
    model: process.env.CUSTOM_AI_MODEL
  },

  // 成本控制
  costControl: {
    maxCostPerRequest: 1.0,  // 单次最大成本 $1
    dailyBudget: 50,          // 每日预算 $50
    enableCompression: true   // 启用压缩
  },

  // Prompt模板路径 (可独立优化)
  prompts: {
    analysis: './prompts/analysis.txt',
    fallback: './prompts/fallback.txt'
  },

  // 数据采集 (V2.0功能,暂不启用)
  dataCollection: {
    enabled: false,
    storagePath: './data/collected',
    maxSamples: 10000
  }
};

/**
 * 图片压缩配置
 */
export const COMPRESSION_CONFIG = {
  maxWidth: 640,
  maxHeight: 640,
  quality: 75,
  format: 'jpeg' as const
};

/**
 * Prompt模板 (内置版本,可被外部文件覆盖)
 */
export const DEFAULT_PROMPTS = {
  analysis: `你是一位专业的猫咪行为解读专家,擅长用可爱温暖的语言解读猫咪的情绪和行为。

请分析这张猫咪图片,提供以下信息:

1. **情绪识别** (Emoji + 标签):
   - 选择最匹配的情绪: 😊开心/😌放松/😰焦虑/😠生气/🤔好奇/😽撒娇
   - 情绪指数: 0-100分

2. **第一人称解读** (猫咪视角):
   - 用"本喵"、"我"自称
   - 可爱、调皮、治愈的语气
   - 50字以内

3. **行为分析**:
   - 当前在做什么?
   - 可能的需求是什么?
   - 身体语言解读

4. **互动建议**:
   - 主人现在可以做什么?
   - 应该避免什么?

5. **表情包文案** (如果适合做表情包):
   - 一句可爱的短文案 (20字以内)

请以JSON格式输出:
{
  "emotion": "😊开心",
  "emotion_score": 85,
  "cat_says": "本喵现在感觉美美的~",
  "behavior_analysis": "...",
  "interaction_suggestion": "...",
  "meme_text": "喵~今天感觉超好的~",
  "meme_category": "撒娇"
}

要求:
- 使用emoji增加可爱感
- 文案要温暖、有共鸣
- 避免专业术语
- 适合分享到社交媒体`,

  fallback: `请分析这张猫咪的情绪状态，用JSON格式输出:
{
  "emotion": "😊开心",
  "emotion_score": 70,
  "cat_says": "本喵感觉还不错~",
  "behavior_analysis": "猫咪看起来很放松",
  "interaction_suggestion": "可以轻轻抚摸",
  "meme_text": "好开心~",
  "meme_category": "撒娇"
}`
};
