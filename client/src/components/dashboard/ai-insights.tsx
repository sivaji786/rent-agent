import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Brain, TrendingUp, Calendar, UserCheck } from "lucide-react";

export default function AIInsights() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  // Generate AI insights based on real data
  const insights = [
    {
      id: 'revenue',
      title: 'Revenue Optimization',
      description: `Consider market analysis for rent adjustments on ${Math.floor((stats?.totalUnits || 0) * 0.3)} units based on current occupancy rates`,
      icon: TrendingUp,
      iconColor: 'text-green-300',
    },
    {
      id: 'maintenance',
      title: 'Maintenance Prediction',
      description: `${stats?.pendingMaintenance || 0} pending requests detected. HVAC systems may need preventive maintenance review`,
      icon: Calendar,
      iconColor: 'text-yellow-300',
    },
    {
      id: 'retention',
      title: 'Tenant Retention',
      description: 'Review upcoming lease expirations and prepare renewal strategies for high-value tenants',
      icon: UserCheck,
      iconColor: 'text-blue-300',
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                AI Insights & Recommendations
              </CardTitle>
              <p className="text-sm text-white text-opacity-80">
                Powered by intelligent automation
              </p>
            </div>
          </div>
          <Button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-20">
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2 mb-2">
                <insight.icon className={`h-4 w-4 ${insight.iconColor}`} />
                <h4 className="font-medium">{insight.title}</h4>
              </div>
              <p className="text-sm text-white text-opacity-90">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
