#!/bin/bash
# KIMI API简单测试
# 使用curl测试API连接和基础功能

API_KEY="sk-wtIziDast1pt8o01A1GoSu12CYk32aJxrLO58s8PMqG9quCn"

echo "🧪 测试KIMI API连接..."
echo ""

# 测试1: 健康检查 - 查询模型列表
echo "📋 测试1: 查询模型列表"
curl -s https://api.moonshot.cn/v1/models \
  -H "Authorization: Bearer $API_KEY" \
  | head -50

echo ""
echo ""
echo "✅ 如果上面显示了模型列表，说明API Key有效！"
echo ""
echo "📸 测试2: 文本对话测试（无需图片）"
echo ""

# 测试2: 简单文本对话
curl -s https://api.moonshot.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "model": "kimi-k2.5",
    "messages": [
      {"role": "system", "content": "你是Kimi。"},
      {"role": "user", "content": "你好，请用一句话介绍你自己"}
    ],
    "temperature": 0.6
  }' | python3 -m json.tool

echo ""
echo "✅ 测试完成！如果上面看到了Kimi的回复，说明API完全可用！"
echo ""
echo "🎯 下一步: 在浏览器中打开 http://localhost:8081 测试APP"
