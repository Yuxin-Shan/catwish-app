# 🐱 猫语心愿 (CatWish)

> 用AI读懂猫咪的心思，生成可爱表情包

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.73.0-blue.svg)](https://reactnative.org/)
[![Expo](https://img.shields.io/badge/Expo-50.0.0-white.svg)](https://expo.dev/)

## ✨ 功能特性

- 📷 **智能拍照** - 拍照或从相册选择猫咪照片
- 🤖 **AI情绪分析** - 精准识别猫咪的7种情绪状态
- 💬 **可爱文案** - 猫咪第一人称的内心独白
- 📋 **行为解读** - 专业的猫咪行为学分析
- 💡 **互动建议** - 针对性的饲养建议
- ✨ **表情包生成** - 一键生成可爱表情包
- 📊 **历史记录** - 记录猫咪的成长历程

## 🎯 核心功能

### 1. 情绪识别
- 😊 开心 - 猫咪心情愉悦，精力充沛
- 😌 放松 - 舒适自在，状态良好
- 😰 焦虑 - 有些不安，需要安抚
- 😠 生气 - 感到不满，需要空间
- 🤔 好奇 - 对周围感兴趣
- 😽 亲昵 - 想要亲近，寻求关注
- 困倦 - 需要休息，准备睡觉

### 2. AI文案生成
- 基于Claude 3.5 Sonnet AI模型
- 可爱的猫咪第一人称视角
- 个性化、富有情感色彩

### 3. 表情包生成器
- 3种滤镜风格（可爱/搞笑/治愈）
- 贴纸选择（最多5个）
- 自定义文字内容
- 一键保存和分享

### 4. 历史记录
- 完整的历史记录保存
- 实时搜索功能
- 时间筛选（今天/本周/本月）
- 一键查看详情

## 🚀 快速开始

### 安装依赖
\`\`\`bash
npm install
\`\`\`

### 启动开发服务器
\`\`\`bash
npx expo start
\`\`\`

### 在手机上运行
1. 下载 **Expo Go** APP
    - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
    - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent.Exponent)
2. 扫描终端显示的二维码
3. 立即在手机上查看效果！

## 🛠️ 技术栈

### 前端
- **框架**: React Native 0.73.0
- **平台**: Expo SDK 50
- **语言**: TypeScript
- **状态管理**: React Hooks + Context API
- **导航**: React Navigation 6

### AI服务
- **模型**: Claude 3.5 Sonnet
- **架构**: 可插拔Provider模式
- **备选**: GPT-4V

### 存储
- **本地**: AsyncStorage
- **云端**: Supabase (可选)

## 📸 应用截图

### 主要界面
- 首页 - 快速入口
- 相机 - 拍照/选择
- 分析 - AI处理
- 结果 - 情绪展示
- 表情包 - 创作工具
- 历史 - 记录管理

## 📊 项目结构

\`\`
CatWishExpo/
├── src/
│   ├── screens/         # 页面组件
│   │   ├── HomeScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── AnalysisScreen.tsx
│   │   ├── ResultScreen.tsx
│   │   ├── MemeEditorScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/        # 服务层
│   │   ├── ai/
│   │   │   ├── AIService.ts
│   │   │   ├── config.ts
│   │   │   └── providers/
│   │   ├── storage.ts
│   │   └── MemeGenerator.ts
│   ├── components/      # 可复用组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Toast.tsx
│   │   └── Skeleton.tsx
│   ├── navigation/      # 导航配置
│   │   └── AppNavigator.tsx
│   ├── context/         # 全局上下文
│   │   └── AppContext.tsx
│   ├── constants/       # 常量
│   │   └── theme.ts
│   ├── types/          # TypeScript类型
│   │   └── navigation.ts
│   └── utils/          # 工具函数
│       └── performance.ts
├── assets/             # 静态资源
├── App.tsx             # 应用入口
├── app.json           # Expo配置
└── package.json       # 依赖管理
\`\`

## 🎨 设计理念

### 品牌色彩
- **主色**: #FFB6C1 (浅粉) - 温暖可爱
- **辅助色**: #87CEEB (天蓝) - 治愈系
- **强调色**: #FFD700 (金黄) - 活力

### 设计原则
- **简洁**: 界面简单直观，操作流畅
- **可爱**: 色彩柔和，表情丰富
- **情感化**: 以猫咪视角，传递温度

## 📝 开发路线

- [x] **Phase 1**: 策略与架构
- [x] **Phase 2**: 基础设施搭建
- [x] **Phase 3**: 核心功能开发
- [x] **Phase 4**: 质量保证与优化
- [ ] **Phase 5**: 发布准备（进行中）

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👨‍💻 作者

Your Name - [GitHub](https://github.com/YOUR_USERNAME)

## 🙏 致谢

感谢所有开源项目：
- React Native团队
- Expo团队
- Claude AI (Anthropic)
- 所有贡献者

## 📞 联系方式

- 邮箱: 939148488@qq.com
- GitHub Issues: [提交问题](https://github.com/YOUR_USERNAME/catwish-app/issues)

---

## 🌟 Star History

如果这个项目对你有帮助，请给个Star ⭐️
