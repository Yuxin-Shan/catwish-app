// Mock React Native components and modules
import React from 'react';

// Mock all React Native components
export const View = ({ children, testID, ...props }) => {
  return React.createElement('View', { testID, ...props }, children);
};

export const Text = ({ children, testID, ...props }) => {
  return React.createElement('Text', { testID, ...props }, children);
};

export const ScrollView = ({ children, ...props }) => {
  return React.createElement('ScrollView', props, children);
};

export const FlatList = ({ data, renderItem, ...props }) => {
  return React.createElement('FlatList', props, data?.map((item, index) => renderItem({ item, index })));
};

export const TouchableOpacity = ({ children, onPress, testID, ...props }) => {
  return React.createElement('TouchableOpacity', {
    testID,
    onClick: onPress,
    ...props
  }, children);
};

export const TouchableHighlight = ({ children, onPress, ...props }) => {
  return React.createElement('TouchableHighlight', {
    onClick: onPress,
    ...props
  }, children);
};

export const TextInput = ({ testID, ...props }) => {
  return React.createElement('TextInput', { testID, ...props });
};

export const Image = ({ testID, ...props }) => {
  return React.createElement('Image', { testID, ...props });
};

export const SafeAreaView = ({ children, ...props }) => {
  return React.createElement('SafeAreaView', props, children);
};

export const ActivityIndicator = ({ testID, ...props }) => {
  return React.createElement('ActivityIndicator', { testID, ...props });
};

export const StatusBar = ({ ...props }) => {
  return React.createElement('StatusBar', props);
};

export const Platform = {
  OS: 'web',
  select: (obj) => obj.web || obj.ios || obj.android || obj.default,
};

export const StyleSheet = {
  create: (styles) => styles,
  flatten: (styles) => styles,
  compose: (style1, style2) => ({ ...style1, ...style2 }),
  hairlineWidth: 1,
};

export const Dimensions = {
  get: (dim) => ({
    width: 375,
    height: 667,
  }),
};

export const Animated = {
  View: ({ children, ...props }) => {
    return React.createElement('Animated.View', props, children);
  },
  Text: ({ children, ...props }) => {
    return React.createElement('Animated.Text', props, children);
  },
  timing: () => ({
    start: (callback) => callback && callback({ finished: true }),
  }),
  spring: () => ({
    start: (callback) => callback && callback({ finished: true }),
  }),
  Value: class {
    constructor(value = 0) {
      this._value = value;
    }
    setValue(value) {
      this._value = value;
    }
    getValue() {
      return this._value;
    }
  },
};

export const Easing = {
  linear: 'linear',
  ease: 'ease',
  easeInOut: 'easeInOut',
};

export const Modal = ({ children, visible, ...props }) => {
  if (!visible) return null;
  return React.createElement('Modal', props, children);
};

export const Linking = {
  openURL: jest.fn(),
  canOpenURL: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

export const Alert = {
  alert: jest.fn(),
  prompt: jest.fn(),
};

export const PixelRatio = {
  getPixelSizeForLayoutSize: (size) => size,
  roundToNearestPixel: (size) => Math.round(size),
};

export default {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Image,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Platform,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Modal,
  Linking,
  Alert,
  PixelRatio,
};
