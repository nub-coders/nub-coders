import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean };

/**
 * Top-level error boundary. If any descendant throws during render, we show a
 * minimal recovery UI instead of white-screening the whole page. Kept
 * dependency-free and styled with the site's recovery classes.
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
        <main className="recovery-page" aria-labelledby="recovery-title">
          <div className="recovery-card">
            <p className="eyebrow">A small interruption</p>
            <h1 className="section-title" id="recovery-title">Something went wrong.</h1>
            <p className="section-intro">
              An unexpected error occurred while rendering this page.
            </p>
            <a href="/" className="button button-primary">← Reload home</a>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
