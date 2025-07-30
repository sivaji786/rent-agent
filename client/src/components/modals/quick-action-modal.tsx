import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import PropertyForm from "@/components/forms/property-form";
import TenantForm from "@/components/forms/tenant-form";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'property' | 'tenant' | 'document';
}

export default function QuickActionModal({ isOpen, onClose, type }: QuickActionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPropertyMutation = useMutation({
    mutationFn: async (propertyData: any) => {
      const response = await apiRequest("POST", "/api/properties", propertyData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      onClose();
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

  const createTenantMutation = useMutation({
    mutationFn: async (tenantData: any) => {
      // Note: In a real app, tenant creation would need special handling
      // as tenants typically sign up themselves through auth
      toast({
        title: "Info",
        description: "Tenant invitation functionality would be implemented here",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenants"] });
      onClose();
    },
  });

  const getModalTitle = () => {
    switch (type) {
      case 'property': return 'Add New Property';
      case 'tenant': return 'Add New Tenant';
      case 'document': return 'Upload Document';
      default: return 'Quick Action';
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'property':
        return (
          <PropertyForm
            onSubmit={(data) => createPropertyMutation.mutate(data)}
            isLoading={createPropertyMutation.isPending}
          />
        );
      
      case 'tenant':
        return (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Add New Tenant</h3>
            <p className="text-gray-600 mb-4">
              Tenant invitation functionality would be implemented here.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        );
      
      case 'document':
        // Close this modal and let the proper DocumentUploadForm handle uploads
        onClose();
        return null;
      
      default:
        return <div>Unknown action type</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
