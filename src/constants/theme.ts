// src/constants/theme.ts
/**
 * 猫语心愿 - 设计系统
 * 品牌色彩、字体、间距等设计Token
 */

export const Colors = {
  // 主色 - 柔和的浅粉色
  primary: '#FFB6C1',
  primaryDark: '#FF9EAA',
  primaryLight: '#FFCED6',

  // 辅助色 - 治愈的天蓝色
  secondary: '#87CEEB',
  secondaryDark: '#6BB8D4',
  secondaryLight: '#A8DCEF',

  // 强调色 - 活力的金黄色
  accent: '#FFD700',
  accentDark: '#FFC700',
  accentLight: '#FFE066',

  // 情绪色
  emotions: {
    happy: '#FFD700',        // 😊 开心 - 金黄
    relaxed: '#87CEEB',       // 😌 放松 - 天蓝
    anxious: '#FFA07A',       // 😰 焦虑 - 浅橙
    angry: '#FF6B6B',         // 😠 生气 - 红色
    curious: '#DDA0DD',       // 🤔 好奇 - 紫色
    affectionate: '#FF69B4'   // 😽 撒娇 - 粉红
  },

  // 中性色
  text: {
    primary: '#333333',
    secondary: '#666666',
    tertiary: '#999999',
    inverse: '#FFFFFF'
  },

  // 背景色
  background: {
    primary: '#FFFFFF',
    secondary: '#FFF5F7',  // 极浅粉背景
    tertiary: '#F5F5F5'
  },

  // 边框色
  border: {
    light: '#E0E0E0',
    default: '#CCCCCC',
    dark: '#999999'
  },

  // 状态色
  status: {
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3'
  }
};

export const Typography = {
  // 标题
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28
  },

  // 正文
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 26
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20
  },

  // 按钮
  buttonLarge: {
    fontSize: 18,
    fontWeight: '600' as const
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as const
  }
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
    elevation: 8
  }
};

// 字体家族
export const FontFamily = {
  regular: 'PingFang SC',
  medium: 'PingFang SC',
  bold: 'PingFang SC'
};

// Z轴层级
export const ZIndex = {
  toast: 1000,
  modal: 900,
  dropdown: 800,
  sticky: 700,
  navbar: 600,
  default: 0
};
