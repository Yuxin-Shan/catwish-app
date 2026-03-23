#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 启动Expo开发服务器..."
echo "📱 请按以下步骤操作："
echo "1. 打开手机上的Expo Go APP"
echo "2. 点击 'Enter URL manually' 或 '输入URL'"
echo "3. 输入下面显示的URL（以exp://开头）"
echo ""
echo "=========================================="
npx expo start
