import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

export default function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Revenue Overview
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              7D
            </Button>
            <Button size="sm" className="bg-blue-100 text-blue-600 hover:bg-blue-200">
              30D
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              90D
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart Placeholder - In a real app, this would use Chart.js or similar */}
        <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Revenue Chart</p>
            <p className="text-sm text-gray-500 mt-1">
              Integration ready for Chart.js or similar library
            </p>
            <div className="mt-4 text-lg font-semibold text-gray-800">
              Monthly Revenue: $45,230
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
