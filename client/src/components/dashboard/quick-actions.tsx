import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuickActionModal from "@/components/modals/quick-action-modal";
import { Plus, UserPlus, Upload } from "lucide-react";

export default function QuickActions() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'property' | 'tenant' | 'document'>('property');

  const handleAction = (type: 'property' | 'tenant' | 'document') => {
    setModalType(type);
    setShowModal(true);
  };

  const actions = [
    {
      id: 'property',
      title: 'Add New Property',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => handleAction('property'),
    },
    {
      id: 'tenant',
      title: 'Add New Tenant',
      icon: UserPlus,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => handleAction('tenant'),
    },
    {
      id: 'document',
      title: 'Upload Document',
      icon: Upload,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => handleAction('document'),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {actions.map((action) => (
              <Button
                key={action.id}
                onClick={action.action}
                className={`w-full flex items-center justify-center px-4 py-3 text-white rounded-lg transition-colors ${action.color}`}
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <QuickActionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
      />
    </>
  );
}
