import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Properties from "@/pages/properties";
import Tenants from "@/pages/tenants";
import Financials from "@/pages/financials";
import Maintenance from "@/pages/maintenance";
import Communication from "@/pages/communication";
import Reports from "@/pages/reports";
import Documents from "@/pages/documents";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/properties" component={Properties} />
          <Route path="/tenants" component={Tenants} />
          <Route path="/financials" component={Financials} />
          <Route path="/maintenance" component={Maintenance} />
          <Route path="/communication" component={Communication} />
          <Route path="/reports" component={Reports} />
          <Route path="/documents" component={Documents} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
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
