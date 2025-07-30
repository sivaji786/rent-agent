import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TenantInviteForm from "@/components/forms/tenant-invite-form";
import { UserPlus } from "lucide-react";

export default function TenantInviteModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full flex items-center justify-center px-4 py-3 text-white rounded-lg transition-colors bg-green-600 hover:bg-green-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Tenant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invite New Tenant</DialogTitle>
          <DialogDescription>
            Send an invitation to a new tenant to join your property.
          </DialogDescription>
        </DialogHeader>
        <TenantInviteForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}