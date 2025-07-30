import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import StatsCards from "@/components/dashboard/stats-cards";
import RevenueChart from "@/components/dashboard/revenue-chart";
import RecentProperties from "@/components/dashboard/recent-properties";
import QuickActions from "@/components/dashboard/quick-actions";
import UrgentTasks from "@/components/dashboard/urgent-tasks";
import RecentMessages from "@/components/dashboard/recent-messages";
import AIInsights from "@/components/dashboard/ai-insights";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <StatsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-8">
              <RevenueChart />
              <RecentProperties />
            </div>
            
            <div className="space-y-8">
              <QuickActions />
              <UrgentTasks />
              <RecentMessages />
            </div>
          </div>

          <div className="mt-8">
            <AIInsights />
          </div>
        </main>
      </div>
    </div>
  );
}
