import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MaintenanceRequest } from "@shared/schema";
import { Wrench, Clock, CheckCircle, AlertTriangle, Plus } from "lucide-react";

export default function Maintenance() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

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

  const { data: maintenanceRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["/api/maintenance-requests"],
    retry: false,
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PUT", `/api/maintenance-requests/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance-requests"] });
      toast({
        title: "Success",
        description: "Maintenance request updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update maintenance request",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertTriangle className="h-4 w-4" />;
      default: return <Wrench className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Maintenance</h1>
              <p className="text-sm text-gray-600 mt-1">Manage maintenance requests and work orders</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {maintenanceRequests?.filter((r: MaintenanceRequest) => r.status === 'pending').length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {maintenanceRequests?.filter((r: MaintenanceRequest) => r.status === 'in_progress').length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {maintenanceRequests?.filter((r: MaintenanceRequest) => r.status === 'completed').length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Urgent</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {maintenanceRequests?.filter((r: MaintenanceRequest) => r.priority === 'urgent').length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Wrench className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Maintenance Requests List */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {requestsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : maintenanceRequests && maintenanceRequests.length > 0 ? (
                <div className="space-y-4">
                  {maintenanceRequests.map((request: MaintenanceRequest) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {getStatusIcon(request.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-gray-900">{request.title}</h3>
                              <Badge className={getPriorityColor(request.priority)}>
                                {request.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Unit: {request.unitId.slice(-8)}</span>
                              <span>Created: {new Date(request.createdAt!).toLocaleDateString()}</span>
                              {request.estimatedCost && (
                                <span>Est. Cost: ${parseFloat(request.estimatedCost).toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                        {request.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateRequestMutation.mutate({ id: request.id, status: 'in_progress' })}
                            disabled={updateRequestMutation.isPending}
                          >
                            Start Work
                          </Button>
                        )}
                        {request.status === 'in_progress' && (
                          <Button
                            size="sm"
                            onClick={() => updateRequestMutation.mutate({ id: request.id, status: 'completed' })}
                            disabled={updateRequestMutation.isPending}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance requests</h3>
                  <p className="text-gray-600">Maintenance requests will appear here when tenants submit them</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
