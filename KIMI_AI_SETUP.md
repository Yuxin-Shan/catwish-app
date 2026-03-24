# KIMI AI集成指南

> 使用月之暗面KIMI K2.5模型进行猫咪情绪分析

---

## 📋 目录

1. [功能介绍](#功能介绍)
2. [快速开始](#快速开始)
3. [配置说明](#配置说明)
4. [测试验证](#测试验证)
5. [提示词优化](#提示词优化)
6. [常见问题](#常见问题)

---

## 🎯 功能介绍

### KIMI K2.5模型优势

- ✅ **性价比高**: ¥12/1M tokens（输入），¥60/1M tokens（输出）
- ✅ **多模态理解**: 支持图片和视频分析
- ✅ **中文优化**: 专门针对中文场景优化
- ✅ **256K长上下文**: 支持复杂任务
- ✅ **无需翻墙**: 国内服务器，访问稳定

### 分析能力

- 🐱 识别7种核心情绪（开心、放松、焦虑、生气、好奇、撒娇、困倦）
- 💬 第一人称可爱文案
- 🔍 专业行为分析
- 💡 互动建议
- 🎨 表情包文案生成

---

## 🚀 快速开始

### 1. 获取API Key

访问 [KIMI开放平台](https://platform.moonshot.cn/) 注册账号：
1. 注册/登录账号
2. 进入"用户中心" → "API密钥"
3. 创建新的API Key（以`sk-`开头）
4. 复制保存

### 2. 配置环境变量

创建 `.env` 文件：

```bash
# 使用KIMI
AI_PROVIDER=kimi
KIMI_API_KEY=sk-your_api_key_here

# 或者使用
MOONSHOT_API_KEY=sk-your_api_key_here
```

### 3. 安装依赖

```bash
npm install
```

### 4. 运行测试

```bash
# Node.js环境
node test-kimi-ai.js

# 或设置环境变量后运行
KIMI_API_KEY=your_key node test-kimi-ai.js
```

---

## ⚙️ 配置说明

### 在代码中使用

```typescript
import { aiService } from './src/services/ai/AIService';

// 使用KIMI分析
const result = await aiService.analyzeImage(imageUri);

console.log(result.emotion);        // "😊开心"
console.log(result.catSays);        // "喵~今天感觉超好的!"
console.log(result.behaviorAnalysis);
```

### 动态切换Provider

```typescript
// 切换到KIMI
await aiService.switchProvider('kimi');

// 切换回Mock
await aiService.switchProvider('mock');

// 检查当前Provider
console.log(aiService.getProviderName()); // "KIMI K2.5 (月之暗面)"
```

### 配置选项

```typescript
import { AIService } from './src/services/ai/AIService';

const service = new AIService({
  currentProvider: 'kimi',
  kimi: {
    apiKey: 'your_key',
    model: 'kimi-k2.5',           // 默认模型
    apiUrl: 'https://api.moonshot.cn/v1'
  },
  costControl: {
    maxCostPerRequest: 1.0,       // 单次最大成本（¥）
    dailyBudget: 50,              // 每日预算（¥）
    enableCompression: true       // 启用压缩
  }
});
```

---

## 🧪 测试验证

### 测试集说明

包含5张不同情绪的猫咪图片：

1. **开心的小橘猫** - 😊开心
2. **放松的英短** - 😌放松
3. **好奇的奶牛猫** - 🤔好奇
4. **撒娇的布偶猫** - 😽撒娇
5. **困倦的缅因猫** - 困倦

### 运行测试

```bash
# 设置API Key
export KIMI_API_KEY=sk-your_key_here

# 运行测试
node test-kimi-ai.js
```

### 测试输出示例

```
🧪 开始KIMI AI测试...

📸 测试 1: 开心的小橘猫
   预期情绪: 😊开心
   描述: 一只橘猫正对着镜头笑，眼睛明亮，表情轻松
   ✅ API调用成功
   🎯 识别情绪: 😊开心 ✓匹配
   💬 猫咪说: 喵~今天感觉超好的!
   📊 情绪分数: 85
   🎬 表情包: 好开心~
   📦 Token使用: 1523

═══════════════════════════════════
📊 测试总结:
   通过率: 5/5 (100%)
   总Token: 7615
   预估费用: ¥0.0914
═══════════════════════════════════
```

---

## 📝 提示词优化

### 系统提示词

```
你是一位专业的猫咪行为解读专家，擅长用可爱温暖的语言解读猫咪的情绪和行为。

你的专长包括：
- 精准识别猫咪的7种核心情绪状态
- 理解猫咪的肢体语言和微表情
- 用猫咪第一人称的视角表达内心想法
- 提供科学的饲养建议和互动指导
- 生成适合社交媒体分享的可爱文案

请始终：
1. 使用温暖、治愈的语气
2. 加入适当的emoji增加可爱感
3. 避免使用过于专业的术语
4. 关注猫咪的福祉和需求
```

### 用户提示词模板

```
请分析这张猫咪图片，提供以下信息（必须以JSON格式输出）：

{
  "emotion": "😊开心",
  "emotion_score": 85,
  "cat_says": "喵~今天感觉超好的!",
  "behavior_analysis": "猫咪表情轻松,眼睛明亮,尾巴竖起,这是开心和自信的表现",
  "interaction_suggestion": "现在可以和猫咪玩耍,它会很开心地参与",
  "meme_text": "好开心~",
  "meme_category": "撒娇"
}

要求：
- emotion: 从以下选择 [😊开心, 😌放松, 😰焦虑, 😠生气, 🤔好奇, 😽撒娇, 困倦]
- emotion_score: 0-100的数字
- cat_says: 猫咪第一人称，30字以内，可爱调皮
- behavior_analysis: 专业但不生硬，分析肢体语言
- interaction_suggestion: 具体可操作的建议
- meme_text: 适合做表情包的短文案，20字以内
- meme_category: [撒娇, 搞笑, 治愈, 调皮] 之一

只输出JSON，不要其他文字。
```

### 优化建议

1. **情绪识别准确度**：
   - 添加更多猫咪表情图片到训练集
   - 细化情绪分类（如添加"饥饿"、"玩耍"等）
   - 考虑猫咪品种特征

2. **文案质量**：
   - 根据用户反馈调整语气
   - 添加更多网络流行语
   - 控制文案长度在20-30字

3. **行为分析**：
   - 添加猫咪肢体语言库
   - 考虑场景因素（室内/室外）
   - 结合猫咪年龄和品种

---

## ❓ 常见问题

### Q1: API调用失败怎么办？

**错误**: `API错误: 401 Unauthorized`

**解决**:
- 检查API Key是否正确
- 确认账户余额充足
- 验证API Key未过期

### Q2: 图片无法识别？

**错误**: `Mock URI不能用于真实AI分析`

**解决**:
- 使用真实图片URI
- 不要使用`mock://`开头的URI
- 确保图片格式为jpeg/png

### Q3: Token消耗太快？

**优化**:
- 启用图片压缩：`enableCompression: true`
- 降低图片分辨率（推荐≤4K）
- 批量处理时控制并发数

### Q4: 识别结果不准确？

**调整**:
- 修改系统提示词
- 添加few-shot示例
- 调整temperature参数（0.3-0.7）

### Q5: 成本预算？

**参考**（单次分析）:
- 输入: ~1000 tokens ≈ ¥0.012
- 输出: ~500 tokens ≈ ¥0.03
- **总计**: ~¥0.042/次

**每日1000次**: ~¥42

---

## 📚 相关文档

- [KIMI API官方文档](https://platform.moonshot.cn/docs)
- [KIMI视觉模型指南](https://platform.moonshot.cn/docs/guide/use-kimi-vision-model)
- [价格说明](https://platform.moonshot.cn/docs/pricing)
- [项目README](./README.md)

---

## 🤝 贡献

如有问题或建议，请：
1. 提交Issue
2. 发送邮件: 939148488@qq.com
3. GitHub: https://github.com/Yuxin-Shan/catwish-app

---

**最后更新**: 2026-03-24
