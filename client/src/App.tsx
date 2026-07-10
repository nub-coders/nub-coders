import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
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
      <div className="relative min-h-screen bg-[var(--bg-primary)]">
        <div
          className="scroll-progress fixed top-0 left-0 h-1 w-full origin-left scale-x-0 z-50 bg-gradient-to-r from-[#f0a500] to-[#ffc233] will-change-transform"
        ></div>
        <div className="relative z-10">
          <Router />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
