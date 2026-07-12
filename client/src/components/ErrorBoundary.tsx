import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean };

/**
 * Top-level error boundary. If any descendant throws during render, we show a
 * minimal recovery UI instead of white-screening the whole page. Kept
 * dependency-free and styled with the site's existing not-found classes.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="portfolio-skin not-found">
          <div className="not-found-inner">
            <span className="not-found-code">Oops</span>
            <h1 className="not-found-title">Something went wrong</h1>
            <p className="not-found-text">
              An unexpected error occurred while rendering this page.
            </p>
            <a href="/" className="not-found-link">← Reload home</a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
