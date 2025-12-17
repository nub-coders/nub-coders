import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import { useTheme } from "@/hooks/useTheme";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Use the theme hook directly
  const { theme } = useTheme();
  
  // Use scroll progress for the progress bar
  const scrollProgress = useScrollProgress();
  
  useEffect(() => {
    const progressBar = document.querySelector('.scroll-progress') as HTMLElement;
    if (progressBar) {
      progressBar.style.width = `${scrollProgress}%`;
    }
  }, [scrollProgress]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`${theme === 'light' ? 'light-mode' : ''} relative min-h-screen`}>
        {/* Full Page Video Background */}
        <div className="fixed inset-0 -z-20 overflow-hidden">
          <video 
            autoPlay 
            muted 
            loop 
            className="w-full h-full object-cover"
          >
            <source src="/assets/background.mp4" type="video/mp4" />
          </video>
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="scroll-progress fixed top-0 left-0 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] w-0 z-50 transition-all duration-300"></div>
        <div className="relative z-10">
          <Router />
        </div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
