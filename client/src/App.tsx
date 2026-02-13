import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout";
import NotFound from "@/pages/not-found";
import { useArthStore } from "@/store/useArthStore";
import { authApi } from "@/api/arthApi";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Track from "@/pages/track";
import Shield from "@/pages/shield";
import Score from "@/pages/score";
import Goals from "@/pages/goals";
import Pulse from "@/pages/pulse";
import FestivalShield from "@/pages/festival-shield";
import Settings from "@/pages/settings";
import Advisor from "@/pages/advisor";

function ProtectedRoute({ component: Component, ...rest }: { component: any, path: string }) {
  const { token } = useArthStore();
  const [, setLocation] = useLocation();

  if (!token) {
    setLocation("/");
    return null;
  }

  return <Route {...rest} component={Component} />;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Landing} />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <ProtectedRoute path="/track" component={Track} />
        <ProtectedRoute path="/shield" component={Shield} />
        <ProtectedRoute path="/festival-shield" component={FestivalShield} />
        <ProtectedRoute path="/score" component={Score} />
        <ProtectedRoute path="/goals" component={Goals} />
        <ProtectedRoute path="/pulse" component={Pulse} />
        <ProtectedRoute path="/settings" component={Settings} />
        <ProtectedRoute path="/advisor" component={Advisor} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const { token, setUser, logout } = useArthStore();
  const [initializing, setInitializing] = useState(!!token);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          setUser(res.data);
        } catch (err) {
          console.error("Session expired");
          logout();
        } finally {
          setInitializing(false);
        }
      }
    };
    initAuth();
  }, []);

  if (initializing) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="text-4xl font-bold text-white tracking-tighter">
            ARTHA <span className="text-primary text-5xl">₳</span>
          </div>
          <div className="h-1 w-32 bg-primary/20 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-[shimmer_2s_infinite]" style={{ width: '50%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
