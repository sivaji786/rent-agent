import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Home, Wrench, Calendar, TrendingUp } from "lucide-react";
import { DashboardStats } from "@/types";

export default function StatsCards() {
  const { toast } = useToast();

  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  if (error && isUnauthorizedError(error as Error)) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const occupancyRate = stats?.totalUnits > 0 
    ? Math.round((stats.occupiedUnits / stats.totalUnits) * 100) 
    : 0;

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Occupied Units",
      value: `${stats?.occupiedUnits || 0}/${stats?.totalUnits || 0}`,
      change: `${occupancyRate}% occupancy`,
      changeType: "neutral" as const,
      icon: Home,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Maintenance Requests",
      value: `${stats?.pendingMaintenance || 0}`,
      change: stats?.pendingMaintenance > 5 ? "High volume" : "Normal",
      changeType: stats?.pendingMaintenance > 5 ? "negative" : "neutral" as const,
      icon: Wrench,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Rent Collection",
      value: "94%",
      change: "On time",
      changeType: "positive" as const,
      icon: Calendar,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className={`text-sm mt-1 flex items-center ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {stat.changeType === 'positive' && <TrendingUp className="h-3 w-3 mr-1" />}
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 ${stat.iconBg} rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
