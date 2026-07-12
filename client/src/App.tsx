import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import { useScrollProgress } from "@/hooks/useScrollProgress";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useScrollProgress();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-shell">
        <div className="scroll-progress"></div>
        <div className="app-content">
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
