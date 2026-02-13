import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout";
import NotFound from "@/pages/not-found";

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

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/track" component={Track} />
        <Route path="/shield" component={Shield} />
        <Route path="/festival-shield" component={FestivalShield} />
        <Route path="/score" component={Score} />
        <Route path="/goals" component={Goals} />
        <Route path="/pulse" component={Pulse} />
        <Route path="/settings" component={Settings} />
        <Route path="/advisor" component={Advisor} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
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
