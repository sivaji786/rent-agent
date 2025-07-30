import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PropertyModal from "@/components/modals/property-modal";
import TenantInviteModal from "@/components/modals/tenant-invite-modal";
import DocumentUploadModal from "@/components/modals/document-upload-modal";

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <PropertyModal />
          <TenantInviteModal />
          <DocumentUploadModal />
        </div>
      </CardContent>
    </Card>
  );
}