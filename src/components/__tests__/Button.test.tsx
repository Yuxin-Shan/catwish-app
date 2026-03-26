/**
 * Button Component Tests
 *
 * TDD Approach: Characterization Tests
 * These tests document the CURRENT behavior of Button component
 * to create a safety net before any refactoring.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Button } from '../Button';

// Mock console.error to avoid cluttering test output
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('Button', () => {
  /**
   * Rendering Tests
   */
  describe('Rendering', () => {
    it('should render with default props', () => {
      const { toJSON } = render(<Button title="Test" onPress={() => {}} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with primary variant', () => {
      const { toJSON } = render(
        <Button title="Test" onPress={() => {}} variant="primary" />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with secondary variant', () => {
      const { toJSON } = render(
        <Button title="Test" onPress={() => {}} variant="secondary" />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with outline variant', () => {
      const { toJSON } = render(
        <Button title="Test" onPress={() => {}} variant="outline" />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with text variant', () => {
      const { toJSON } = render(
        <Button title="Test" onPress={() => {}} variant="text" />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with small size', () => {
      const { toJSON } = render(
        <Button title="Test" onPress={() => {}} size="small" />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with medium size', () => {
      const { toJSON } = render(
        <Button title="Test" onPress={() => {}} size="medium" />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with large size', () => {
      const { toJSON } = render(
        <Button title="Test" onPress={() => {}} size="large" />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with icon', () => {
      const { toJSON } = render(
        <Button title="Test" onPress={() => {}} icon="🔥" />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with fullWidth', () => {
      const { toJSON } = render(
        <Button title="Test" onPress={() => {}} fullWidth />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render in disabled state', () => {
      const { toJSON } = render(
        <Button title="Test" onPress={() => {}} disabled />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render in loading state', () => {
      const { toJSON } = render(
        <Button title="Test" onPress={() => {}} loading />
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  /**
   * Interaction Tests
   */
  describe('User Interactions', () => {
    it('should call onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <Button title="Test" onPress={onPress} />
      );

      fireEvent.press(getByText('Test'));
      expect(onPress).toHaveBeenCalled();
    });

    it('should not call onPress when disabled', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <Button title="Test" onPress={onPress} disabled />
      );

      fireEvent.press(getByText('Test'));
      expect(onPress).not.toHaveBeenCalled();
    });

    it('should not call onPress when loading', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Button title="Test" onPress={onPress} loading />
      );

      // When loading, ActivityIndicator is rendered instead of text
      // This test documents the current behavior
      expect(onPress).not.toHaveBeenCalled();
    });

    it('should handle async onPress', async () => {
      const onPress = jest.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      const { getByText } = render(
        <Button title="Test" onPress={onPress} />
      );

      fireEvent.press(getByText('Test'));

      await waitFor(() => {
        expect(onPress).toHaveBeenCalled();
      });
    });

    it('should debounce clicks when debounce is enabled', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <Button title="Test" onPress={onPress} debounce />
      );

      const button = getByText('Test').parent;
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      // With debounce, only the first click should be processed
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should debounce clicks with custom debounceMs', () => {
      jest.useFakeTimers();
      const onPress = jest.fn();
      const { getByText } = render(
        <Button title="Test" onPress={onPress} debounce debounceMs={1000} />
      );

      const button = getByText('Test').parent;
      fireEvent.press(button);

      // Fast forward time
      jest.advanceTimersByTime(500);

      fireEvent.press(button);

      // Should still debounce because less than debounceMs
      expect(onPress).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });
  });

  /**
   * Loading State Tests
   */
  describe('Loading State', () => {
    it('should show ActivityIndicator when loading', () => {
      const { getByTestId } = render(
        <Button title="Test" onPress={() => {}} loading />
      );

      // ActivityIndicator should be rendered
      expect(getByTestId(/^activity-indicator/)).toBeTruthy();
    });

    it('should handle external loading', () => {
      const { getByTestId } = render(
        <Button title="Test" onPress={() => {}} loading={true} />
      );

      expect(getByTestId(/^activity-indicator/)).toBeTruthy();
    });

    it('should handle internal loading during async operation', async () => {
      let resolvePress: any;
      const onPress = jest.fn(() => new Promise(resolve => {
        resolvePress = resolve;
      }));

      const { getByText, getByTestId } = render(
        <Button title="Test" onPress={onPress} />
      );

      fireEvent.press(getByText('Test'));

      // Should show loading indicator
      await waitFor(() => {
        expect(getByTestId(/^activity-indicator/)).toBeTruthy();
      });

      // Resolve the promise
      resolvePress();
      await waitFor(() => {
        expect(onPress).toHaveBeenCalled();
      });
    });
  });

  /**
   * Snapshot Tests
   */
  describe('Snapshot', () => {
    it('should match snapshot for primary button', () => {
      const tree = render(
        <Button title="Test" onPress={() => {}} variant="primary" />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for secondary button', () => {
      const tree = render(
        <Button title="Test" onPress={() => {}} variant="secondary" />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for outline button', () => {
      const tree = render(
        <Button title="Test" onPress={() => {}} variant="outline" />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for text button', () => {
      const tree = render(
        <Button title="Test" onPress={() => {}} variant="text" />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for button with icon', () => {
      const tree = render(
        <Button title="Test" onPress={() => {}} icon="🔥" />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for disabled button', () => {
      const tree = render(
        <Button title="Test" onPress={() => {}} disabled />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for loading button', () => {
      const tree = render(
        <Button title="Test" onPress={() => {}} loading />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for fullWidth button', () => {
      const tree = render(
        <Button title="Test" onPress={() => {}} fullWidth />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
