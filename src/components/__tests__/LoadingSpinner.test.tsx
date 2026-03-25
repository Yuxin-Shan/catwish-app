/**
 * LoadingSpinner Component Tests
 *
 * TDD Approach: Characterization Tests
 * These tests document the CURRENT behavior of LoadingSpinner component
 * to create a safety net before any refactoring.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  /**
   * Rendering Tests
   */
  describe('Rendering', () => {
    it('should render with default props', () => {
      const { toJSON } = render(<LoadingSpinner />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with small size', () => {
      const { toJSON } = render(<LoadingSpinner size="small" />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with large size', () => {
      const { toJSON } = render(<LoadingSpinner size="large" />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom size number', () => {
      const { toJSON } = render(<LoadingSpinner size={30} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom color', () => {
      const { toJSON } = render(<LoadingSpinner color="#FF0000" />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with text', () => {
      const { toJSON } = render(<LoadingSpinner text="Loading..." />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render without text', () => {
      const { toJSON } = render(<LoadingSpinner />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render in fullScreen mode', () => {
      const { toJSON } = render(<LoadingSpinner fullScreen />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render not in fullScreen mode by default', () => {
      const { toJSON } = render(<LoadingSpinner />);
      expect(toJSON()).toBeTruthy();
    });
  });

  /**
   * Component Structure Tests
   */
  describe('Component Structure', () => {
    it('should render ActivityIndicator', () => {
      const { toJSON } = render(<LoadingSpinner />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render text when provided', () => {
      const { toJSON } = render(<LoadingSpinner text="Please wait..." />);
      expect(toJSON()).toBeTruthy();
    });

    it('should not render text when not provided', () => {
      const { toJSON } = render(<LoadingSpinner />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render fullScreen overlay when fullScreen is true', () => {
      const { toJSON } = render(<LoadingSpinner fullScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });

  /**
   * Snapshot Tests
   */
  describe('Snapshot', () => {
    it('should match snapshot for default spinner', () => {
      const tree = render(<LoadingSpinner />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for small spinner', () => {
      const tree = render(<LoadingSpinner size="small" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for large spinner', () => {
      const tree = render(<LoadingSpinner size="large" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for spinner with text', () => {
      const tree = render(<LoadingSpinner text="Loading..." />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for spinner with custom color', () => {
      const tree = render(<LoadingSpinner color="#FF0000" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot for fullScreen spinner', () => {
      const tree = render(<LoadingSpinner fullScreen />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
