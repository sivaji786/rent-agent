import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { Building } from "lucide-react";
import { Property } from "@shared/schema";

export default function RecentProperties() {
  const { toast } = useToast();

  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Properties
          </CardTitle>
          <Button variant="ghost" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="space-y-4">
            {properties.slice(0, 3).map((property) => {
              // Calculate occupancy rate (mock data for now)
              const occupancyRate = Math.floor(Math.random() * 20) + 80; // 80-100%
              const monthlyRevenue = property.totalUnits * 1500; // Estimate based on units
              
              return (
                <div
                  key={property.id}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{property.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{property.address}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <Badge 
                        variant={occupancyRate > 90 ? "default" : "secondary"}
                        className={occupancyRate > 90 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}
                      >
                        {occupancyRate}% Occupied
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {property.totalUnits} Units
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${monthlyRevenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Monthly</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Add your first property to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
