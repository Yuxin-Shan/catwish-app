// src/components/__tests__/ScreenHeader.test.tsx
/**
 * ScreenHeader 组件测试
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ScreenHeader from '../ScreenHeader';

describe('ScreenHeader', () => {
  // Mock Ionicons
  jest.mock('@expo/vector-icons', () => ({
    Ionicons: {
      glyphMap: {},
      name: 'arrow-back'
    }
  }));

  describe('渲染测试', () => {
    it('应该正确渲染基本组件', () => {
      const { getByText } = render(<ScreenHeader title="测试标题" />);

      expect(getByText('测试标题')).toBeTruthy();
    });

    it('应该显示返回按钮当提供 onBack 时', () => {
      const onBack = jest.fn();
      const { getByTestId } = render(
        <ScreenHeader title="测试" onBack={onBack} />
      );

      expect(getByTestId('back-button')).toBeTruthy();
      expect(getByTestId('back-icon')).toBeTruthy();
    });

    it('不应该显示返回按钮当不提供 onBack 时', () => {
      const { queryByTestId } = render(<ScreenHeader title="测试" />);

      expect(queryByTestId('back-button')).toBeNull();
    });

    it('应该显示右侧按钮当提供 rightIcon 时', () => {
      const onRightPress = jest.fn();
      const { getByTestId } = render(
        <ScreenHeader
          title="测试"
          rightIcon="settings"
          onRightPress={onRightPress}
        />
      );

      expect(getByTestId('right-button')).toBeTruthy();
      expect(getByTestId('right-icon')).toBeTruthy();
    });

    it('不应该显示右侧按钮当不提供 rightIcon 时', () => {
      const { queryByTestId } = render(<ScreenHeader title="测试" />);

      expect(queryByTestId('right-button')).toBeNull();
    });

    it('应该应用自定义样式', () => {
      const customStyle = { backgroundColor: '#FF0000' };
      const { getByTestId } = render(
        <ScreenHeader title="测试" style={customStyle} testID="custom-header" />
      );

      expect(getByTestId('custom-header')).toBeTruthy();
    });

    it('应该正确应用自定义颜色', () => {
      const { getByText } = render(
        <ScreenHeader
          title="测试标题"
          titleColor="#FF0000"
          iconColor="#00FF00"
        />
      );

      const titleElement = getByText('测试标题');
      expect(titleElement.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            color: '#FF0000'
          })
        ])
      );
    });

    it('标题应该只显示一行', () => {
      const longTitle = '这是一个非常非常非常非常非常长的标题';
      const { getByText } = render(<ScreenHeader title={longTitle} />);

      const titleElement = getByText(longTitle);
      expect(titleElement.props.numberOfLines).toBe(1);
    });
  });

  describe('交互测试', () => {
    it('应该调用 onBack 当点击返回按钮', () => {
      const onBack = jest.fn();
      const { getByTestId } = render(
        <ScreenHeader title="测试" onBack={onBack} />
      );

      fireEvent.press(getByTestId('back-button'));
      expect(onBack).toHaveBeenCalledTimes(1);
    });

    it('应该调用 onRightPress 当点击右侧按钮', () => {
      const onRightPress = jest.fn();
      const { getByTestId } = render(
        <ScreenHeader
          title="测试"
          rightIcon="settings"
          onRightPress={onRightPress}
        />
      );

      fireEvent.press(getByTestId('right-button'));
      expect(onRightPress).toHaveBeenCalledTimes(1);
    });

    it('应该支持无操作按钮的标题显示', () => {
      const { getByText, queryByTestId } = render(
        <ScreenHeader title="纯标题" />
      );

      expect(getByText('纯标题')).toBeTruthy();
      expect(queryByTestId('back-button')).toBeNull();
      expect(queryByTestId('right-button')).toBeNull();
    });
  });

  describe('快照测试', () => {
    it('应该匹配快照 - 基本版本', () => {
      const tree = render(<ScreenHeader title="测试标题" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('应该匹配快照 - 带返回按钮', () => {
      const onBack = jest.fn();
      const tree = render(
        <ScreenHeader title="测试" onBack={onBack} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('应该匹配快照 - 带右侧按钮', () => {
      const onRightPress = jest.fn();
      const tree = render(
        <ScreenHeader
          title="测试"
          rightIcon="settings"
          onRightPress={onRightPress}
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('应该匹配快照 - 完整版本', () => {
      const onBack = jest.fn();
      const onRightPress = jest.fn();
      const tree = render(
        <ScreenHeader
          title="完整标题"
          onBack={onBack}
          rightIcon="refresh"
          onRightPress={onRightPress}
          titleColor="#333"
          iconColor="#666"
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('可访问性测试', () => {
    it('返回按钮应该有正确的可访问性属性', () => {
      const { getByTestId } = render(<ScreenHeader title="测试" onBack={jest.fn()} />);

      const backButton = getByTestId('back-button');
      expect(backButton.props.accessibilityRole).toBe('button');
      expect(backButton.props.accessibilityLabel).toBe('返回');
    });

    it('右侧按钮应该有 button 角色', () => {
      const { getByTestId } = render(
        <ScreenHeader
          title="测试"
          rightIcon="settings"
          onRightPress={jest.fn()}
        />
      );

      const rightButton = getByTestId('right-button');
      expect(rightButton.props.accessibilityRole).toBe('button');
    });
  });
});
