/**
 * KIMI AI测试脚本
 * 测试猫咪情绪分析功能
 */

const fs = require('fs');
const path = require('path');

function loadLocalEnv() {
  const candidateFiles = ['.env.local', '.env'];

  for (const filename of candidateFiles) {
    const filepath = path.join(__dirname, filename);

    if (!fs.existsSync(filepath)) {
      continue;
    }

    const content = fs.readFileSync(filepath, 'utf8');
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex <= 0) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

loadLocalEnv();

// 测试数据集 - 5张不同情绪的猫咪图片
const TEST_DATASET = [
  {
    id: 1,
    name: '开心的小橘猫',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=640',
    expectedEmotion: '😊开心',
    description: '一只橘猫正对着镜头笑，眼睛明亮，表情轻松'
  },
  {
    id: 2,
    name: '放松的英短',
    imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=640',
    expectedEmotion: '😌放松',
    description: '一只英短猫侧躺着，眼睛微闭，身体舒展'
  },
  {
    id: 3,
    name: '好奇的奶牛猫',
    imageUrl: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=640',
    expectedEmotion: '🤔好奇',
    description: '一只奶牛猫歪着头，睁大眼睛看着什么'
  },
  {
    id: 4,
    name: '撒娇的布偶猫',
    imageUrl: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=640',
    expectedEmotion: '😽撒娇',
    description: '一只布偶猫伸出爪子，眼神柔和求摸摸'
  },
  {
    id: 5,
    name: '困倦的缅因猫',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=640',
    expectedEmotion: '困倦',
    description: '一只缅因猫眼睛半睁半闭，正准备睡觉'
  }
];

/**
 * 测试单个图片
 */
async function testImage(apiKey, imageUrl, expectedEmotion) {
  try {
    // 将图片转为base64
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    // 调用KIMI API
    const apiResponse = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'kimi-k2.5',
        messages: [
          {
            role: 'system',
            content: `你是一位专业的猫咪行为解读专家，擅长用可爱温暖的语言解读猫咪的情绪和行为。

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
4. 关注猫咪的福祉和需求`
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64}`
                }
              },
              {
                type: 'text',
                text: `请分析这张猫咪图片，提供以下信息（必须以JSON格式输出）：

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

只输出JSON，不要其他文字。`
              }
            ]
          }
        ],
        temperature: 0.6
      })
    });

    if (!apiResponse.ok) {
      const error = await apiResponse.json();
      throw new Error(`API错误: ${error.error?.message || apiResponse.statusText}`);
    }

    const data = await apiResponse.json();
    const content = data.choices[0].message.content;

    // 解析JSON
    let jsonStr = content;
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                     content.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    const result = JSON.parse(jsonStr);

    // 验证结果
    const emotionMatch = result.emotion === expectedEmotion;
    const hasRequiredFields = result.emotion && result.cat_says && result.behavior_analysis;

    return {
      success: true,
      result,
      emotionMatch,
      hasRequiredFields,
      usage: data.usage
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 运行所有测试
 */
async function runTests() {
  const apiKey = process.env.KIMI_API_KEY || process.env.MOONSHOT_API_KEY;

  if (!apiKey) {
    console.error('❌ 错误: 未配置 KIMI_API_KEY 或 MOONSHOT_API_KEY');
    process.exit(1);
  }

  console.log('🧪 开始KIMI AI测试...\n');
  console.log('API Key 已加载\n');

  let passedTests = 0;
  let totalTokens = 0;

  for (const test of TEST_DATASET) {
    console.log(`📸 测试 ${test.id}: ${test.name}`);
    console.log(`   预期情绪: ${test.expectedEmotion}`);
    console.log(`   描述: ${test.description}`);

    const result = await testImage(apiKey, test.imageUrl, test.expectedEmotion);

    if (result.success) {
      console.log(`   ✅ API调用成功`);
      console.log(`   🎯 识别情绪: ${result.result.emotion} ${result.emotionMatch ? '✓匹配' : '✗不匹配'}`);
      console.log(`   💬 猫咪说: ${result.result.cat_says}`);
      console.log(`   📊 情绪分数: ${result.result.emotion_score}`);
      console.log(`   🎬 表情包: ${result.result.meme_text}`);
      console.log(`   📦 Token使用: ${result.usage.total_tokens}`);

      if (result.emotionMatch) passedTests++;
      totalTokens += result.usage.total_tokens;
    } else {
      console.log(`   ❌ 失败: ${result.error}`);
    }

    console.log('');
  }

  // 总结
  console.log('═══════════════════════════════════');
  console.log(`📊 测试总结:`);
  console.log(`   通过率: ${passedTests}/${TEST_DATASET.length} (${Math.round(passedTests/TEST_DATASET.length*100)}%)`);
  console.log(`   总Token: ${totalTokens}`);
  console.log(`   预估费用: ¥${((totalTokens / 1_000_000) * 12).toFixed(4)}`);
  console.log('═══════════════════════════════════');
}

// 运行测试
runTests().catch(console.error);

// 导出供Node.js使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TEST_DATASET, testImage, runTests };
}
