import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { useTheme } from "@/hooks/useTheme";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useEffect, lazy, Suspense } from "react";

// Lazy load pages for code splitting
const Home = lazy(() => import("@/pages/Home"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div></div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  // Use the theme hook directly
  const { theme } = useTheme();
  
  // Use scroll progress for the progress bar
  const scrollProgress = useScrollProgress();

  return (
    <QueryClientProvider client={queryClient}>
      <div className={theme === 'light' ? 'light-mode' : ''}>
        <div 
          className="scroll-progress fixed top-0 left-0 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] z-50 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        ></div>
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
