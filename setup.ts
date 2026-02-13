import { mock } from "bun:test";

mock.module("react", () => ({
  useState: (initial: any) => [initial, () => {}],
  useEffect: () => {},
  useMemo: (fn: any) => fn(),
  useCallback: (fn: any) => fn,
  useRef: (initial: any) => ({ current: initial }),
  forwardRef: (fn: any) => fn,
  default: {
    useState: (initial: any) => [initial, () => {}],
    useEffect: () => {},
    forwardRef: (fn: any) => fn,
  }
}));

mock.module("lucide-react", () => ({
  X: () => null,
}));

mock.module("clsx", () => ({
  default: (...args: any[]) => args.join(" "),
  clsx: (...args: any[]) => args.join(" "),
}));

mock.module("tailwind-merge", () => ({
  twMerge: (...args: any[]) => args.join(" "),
}));

mock.module("@radix-ui/react-toast", () => ({
  Provider: ({ children }: any) => children,
  Viewport: ({ children }: any) => children,
  Root: ({ children }: any) => children,
  Title: ({ children }: any) => children,
  Description: ({ children }: any) => children,
  Action: ({ children }: any) => children,
  Close: ({ children }: any) => children,
}));

mock.module("class-variance-authority", () => ({
  cva: () => () => "",
}));

mock.module("@/lib/utils", () => ({
  cn: (...args: any[]) => args.join(" "),
}));
