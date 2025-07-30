import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DocumentUploadForm from "@/components/forms/document-upload-form";
import PropertyForm from "@/components/forms/property-form";
import TenantInviteForm from "@/components/forms/tenant-invite-form";
import { Plus, UserPlus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function QuickActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPropertyMutation = useMutation({
    mutationFn: async (propertyData: any) => {
      const response = await apiRequest("POST", "/api/properties", propertyData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Success",
        description: "Property created successfully",
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
        description: "Failed to create property",
        variant: "destructive",
      });
    },
  });

  const actions = [
    {
      id: 'property',
      title: 'Add New Property',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700',
      component: (
        <PropertyForm
          onSubmit={(data) => createPropertyMutation.mutate(data)}
          isLoading={createPropertyMutation.isPending}
        />
      ),
    },
    {
      id: 'tenant',
      title: 'Add New Tenant',
      icon: UserPlus,
      color: 'bg-green-600 hover:bg-green-700',
      component: <TenantInviteForm />,
    },
    {
      id: 'document',
      title: 'Upload Document',
      icon: Upload,
      color: 'bg-purple-600 hover:bg-purple-700',
      component: <DocumentUploadForm />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => (
            action.component ? (
              <div key={action.id}>
                {action.component}
              </div>
            ) : (
              <Button
                key={action.id}
                onClick={action.action}
                className={`w-full flex items-center justify-center px-4 py-3 text-white rounded-lg transition-colors ${action.color}`}
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.title}
              </Button>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  );
}