import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Brain, TrendingUp, Calendar, UserCheck } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function AIInsights() {
  const [showModal, setShowModal] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  // Generate AI insights based on real data
  const insights = [
    {
      id: 'revenue',
      title: 'Revenue Optimization',
      description: `Consider market analysis for rent adjustments on ${Math.floor(((stats as any)?.totalUnits || 0) * 0.3)} units based on current occupancy rates`,
      icon: TrendingUp,
      iconColor: 'text-green-300',
    },
    {
      id: 'maintenance',
      title: 'Maintenance Prediction',
      description: `${(stats as any)?.pendingMaintenance || 0} pending requests detected. HVAC systems may need preventive maintenance review`,
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
          <Button 
            onClick={() => setShowModal(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-20"
          >
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              onClick={() => {
                setSelectedInsight(insight.id);
                setShowModal(true);
              }}
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
      
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              AI Insights Detail
            </DialogTitle>
            <DialogDescription>
              Detailed analysis for {selectedInsight ? insights.find(i => i.id === selectedInsight)?.title : 'all insights'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedInsight ? (
              <div className="space-y-4">
                {(() => {
                  const insight = insights.find(i => i.id === selectedInsight);
                  if (!insight) return null;
                  
                  return (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <insight.icon className={`h-5 w-5 ${insight.iconColor}`} />
                        <h3 className="text-lg font-semibold">{insight.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">{insight.description}</p>
                      
                      <div className="space-y-3">
                        {insight.id === 'revenue' && (
                          <>
                            <div className="p-3 bg-green-50 rounded-lg border">
                              <h4 className="font-medium">Market Analysis Recommendation</h4>
                              <p className="text-sm text-muted-foreground">Review rent prices for units with lease renewals in the next 90 days</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg border">
                              <h4 className="font-medium">Vacant Unit Optimization</h4>
                              <p className="text-sm text-muted-foreground">Adjust pricing for vacant units based on current market conditions</p>
                            </div>
                          </>
                        )}
                        
                        {insight.id === 'maintenance' && (
                          <>
                            <div className="p-3 bg-yellow-50 rounded-lg border">
                              <h4 className="font-medium">Preventive Maintenance</h4>
                              <p className="text-sm text-muted-foreground">Schedule HVAC inspections for units with high energy usage</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg border">
                              <h4 className="font-medium">Equipment Monitoring</h4>
                              <p className="text-sm text-muted-foreground">Track appliance performance to predict failures before they occur</p>
                            </div>
                          </>
                        )}
                        
                        {insight.id === 'retention' && (
                          <>
                            <div className="p-3 bg-blue-50 rounded-lg border">
                              <h4 className="font-medium">Early Renewal Program</h4>
                              <p className="text-sm text-muted-foreground">Offer incentives for tenants to renew leases 60+ days early</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg border">
                              <h4 className="font-medium">Satisfaction Surveys</h4>
                              <p className="text-sm text-muted-foreground">Deploy quarterly surveys to identify tenant concerns proactively</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">All AI Insights</h3>
                {insights.map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <insight.icon className={`h-4 w-4 ${insight.iconColor}`} />
                      <h4 className="font-medium">{insight.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
