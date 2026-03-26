declare const describe: any;
declare const it: any;
declare const test: any;
declare const expect: any;
declare const beforeAll: any;
declare const afterAll: any;
declare const beforeEach: any;
declare const afterEach: any;

declare namespace jest {
  type Mock = any;
}

declare const jest: {
  fn: (...args: any[]) => any;
  mock: (...args: any[]) => any;
  spyOn: (...args: any[]) => any;
  clearAllMocks: () => void;
  restoreAllMocks: () => void;
  requireActual: (moduleName: string) => any;
  useFakeTimers: () => void;
  useRealTimers: () => void;
  advanceTimersByTime: (ms: number) => void;
  runOnlyPendingTimers: () => void;
};
