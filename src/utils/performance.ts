// src/utils/performance.ts
/**
 * 性能优化工具函数
 */

import React, { useCallback, useRef, useEffect } from 'react';

/**
 * 防抖Hook
 * @param fn 要防抖的函数
 * @param delay 延迟时间(毫秒)
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay]
  );
}

/**
 * 节流Hook
 * @param fn 要节流的函数
 * @param limit 时间限制(毫秒)
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  const inThrottleRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (inThrottleRef.current) {
        return;
      }

      fn(...args);
      inThrottleRef.current = true;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        inThrottleRef.current = false;
      }, limit);
    },
    [fn, limit]
  );
}

/**
 * 性能监控Hook
 * @param componentName 组件名称
 */
export function usePerformanceMonitor(componentName: string) {
  const renderCountRef = useRef(0);
  const mountTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (mountTimeRef.current === null) {
      mountTimeRef.current = Date.now();
    }

    renderCountRef.current += 1;
  });

  const getReport = useCallback(() => {
    const mountTime = mountTimeRef.current ?? 0;

    return {
      component: componentName,
      renders: renderCountRef.current,
      mountTime,
      uptime: mountTime ? Date.now() - mountTime : 0
    };
  }, [componentName]);

  return { getReport };
}

/**
 * 懒加载组件
 * @param importFunc 动态import函数
 * @param fallback 加载中的占位组件
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ComponentType = () => null
): React.LazyExoticComponent<T> {
  return React.lazy(() =>
    importFunc().catch((error) => {
      console.error('Lazy load error:', error);
      // 返回一个默认组件或错误组件
      // 注意: 这里需要 as any，因为类型系统无法表达错误情况下的默认组件
      return {
        default: fallback as T
      } as { default: T };
    })
  );
}

/**
 * 图片缓存优化
 */
export const imageCache = new Map<string, string>();

export function getCachedImage(uri: string): string | null {
  return imageCache.get(uri) || null;
}

export function setCachedImage(uri: string, base64: string): void {
  // 限制缓存大小
  if (imageCache.size > 50) {
    const firstKey = imageCache.keys().next().value;
    imageCache.delete(firstKey);
  }

  imageCache.set(uri, base64);
}

/**
 * 批量更新优化
 */
export function batchUpdates(updates: Array<() => void>) {
  updates.forEach((update, index) => {
    // 使用requestIdleCallback批量执行
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => update(), {
        timeout: index * 10
      });
    } else {
      // 降级方案
      setTimeout(() => update(), index * 10);
    }
  });
}
