/**
 * Performance Utils Tests
 *
 * TDD Approach: Characterization Tests
 * These tests document the CURRENT behavior of performance utility functions
 * to create a safety net before any refactoring.
 */

import { renderHook, act } from '@testing-library/react-native';
import { useDebounce, useThrottle } from '../performance';

// Mock timers
jest.useFakeTimers();

describe('Performance Utils', () => {
  describe('useDebounce', () => {
    it('should debounce function calls', () => {
      const fn = jest.fn();
      const { result } = renderHook(() => useDebounce(fn, 500));

      // Call the debounced function multiple times
      act(() => {
        result.current('test1');
        result.current('test2');
        result.current('test3');
      });

      // Function should not be called yet
      expect(fn).not.toHaveBeenCalled();

      // Fast forward time
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Function should be called once with last arguments
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('test3');
    });

    it('should reset timer on each call', () => {
      const fn = jest.fn();
      const { result } = renderHook(() => useDebounce(fn, 500));

      act(() => {
        result.current('test1');
      });

      // Advance time partially
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Call again
      act(() => {
        result.current('test2');
      });

      // Function should not be called yet
      expect(fn).not.toHaveBeenCalled();

      // Advance time to complete debounce
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Function should be called once
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('test2');
    });

    it('should handle multiple arguments', () => {
      const fn = jest.fn();
      const { result } = renderHook(() => useDebounce(fn, 500));

      act(() => {
        result.current('arg1', 'arg2', 123);
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2', 123);
    });
  });

  describe('useThrottle', () => {
    it('should throttle function calls', () => {
      const fn = jest.fn();
      const { result } = renderHook(() => useThrottle(fn, 500));

      // Call the throttled function multiple times
      act(() => {
        result.current('test1');
        result.current('test2');
        result.current('test3');
      });

      // Function should be called only once (first call)
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('test1');
    });

    it('should allow call after throttle period', () => {
      const fn = jest.fn();
      const { result } = renderHook(() => useThrottle(fn, 500));

      // First call
      act(() => {
        result.current('test1');
      });

      expect(fn).toHaveBeenCalledTimes(1);

      // Advance time past throttle period
      act(() => {
        jest.advanceTimersByTime(600);
      });

      // Second call should go through
      act(() => {
        result.current('test2');
      });

      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenCalledWith('test2');
    });

    it('should handle multiple arguments', () => {
      const fn = jest.fn();
      const { result } = renderHook(() => useThrottle(fn, 500));

      act(() => {
        result.current('arg1', 'arg2', 123);
      });

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2', 123);
    });
  });
});
