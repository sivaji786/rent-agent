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
import DocumentUploadForm from "@/components/forms/document-upload-form";
import { Upload } from "lucide-react";

export default function DocumentUploadModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full flex items-center justify-center px-4 py-3 text-white rounded-lg transition-colors bg-purple-600 hover:bg-purple-700">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document to your property management system.
          </DialogDescription>
        </DialogHeader>
        <DocumentUploadForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}