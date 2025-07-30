import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isUnauthorizedError } from "@/lib/authUtils";
import { BarChart3, FileText, Download, TrendingUp, DollarSign, Home, Users, Calendar } from "lucide-react";

export default function Reports() {
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

  const reportCategories = [
    {
      title: "Financial Reports",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
      reports: [
        { name: "Revenue Summary", description: "Monthly and yearly revenue breakdown" },
        { name: "Rent Roll", description: "Current rent status for all units" },
        { name: "Expense Report", description: "Property maintenance and operational costs" },
        { name: "Profit & Loss", description: "Comprehensive financial performance" },
      ]
    },
    {
      title: "Property Reports",
      icon: Home,
      color: "bg-blue-100 text-blue-600",
      reports: [
        { name: "Occupancy Report", description: "Unit occupancy rates and trends" },
        { name: "Property Performance", description: "Individual property metrics" },
        { name: "Maintenance Summary", description: "Work orders and completion rates" },
        { name: "Vacancy Analysis", description: "Vacant units and market trends" },
      ]
    },
    {
      title: "Tenant Reports",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
      reports: [
        { name: "Tenant Directory", description: "Complete tenant contact information" },
        { name: "Lease Expiration", description: "Upcoming lease renewals and expirations" },
        { name: "Payment History", description: "Tenant payment records and patterns" },
        { name: "Communication Log", description: "Tenant interactions and notes" },
      ]
    },
    {
      title: "Operational Reports",
      icon: BarChart3,
      color: "bg-amber-100 text-amber-600",
      reports: [
        { name: "Monthly Dashboard", description: "Key performance indicators overview" },
        { name: "Maintenance Trends", description: "Recurring issues and patterns" },
        { name: "Collection Report", description: "Rent collection performance" },
        { name: "Move-in/Move-out", description: "Tenant turnover analysis" },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-sm text-gray-600 mt-1">Generate and export property management reports</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reports Generated</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">24</p>
                    <p className="text-sm text-green-600 mt-1">This month</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">+12.5%</p>
                    <p className="text-sm text-green-600 mt-1">vs last month</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">91%</p>
                    <p className="text-sm text-blue-600 mt-1">142/156 units</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Home className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">94%</p>
                    <p className="text-sm text-green-600 mt-1">On time payments</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {reportCategories.map((category, index) => (
              <Card key={index} className="h-fit">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.reports.map((report, reportIndex) => (
                      <div key={reportIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{report.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Reports */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Monthly Revenue Summary - December 2024", type: "Financial", date: "2024-12-31", size: "2.4 MB" },
                  { name: "Q4 Occupancy Report", type: "Property", date: "2024-12-30", size: "1.8 MB" },
                  { name: "Maintenance Cost Analysis", type: "Operational", date: "2024-12-29", size: "3.1 MB" },
                  { name: "Tenant Payment History", type: "Tenant", date: "2024-12-28", size: "1.5 MB" },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{report.type}</span>
                          <span>•</span>
                          <span>{new Date(report.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
