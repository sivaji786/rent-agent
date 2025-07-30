import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertDocumentSchema, type InsertDocument } from "@shared/schema";
import { ObjectUploader } from "@/components/ObjectUploader";
import { z } from "zod";
import type { UploadResult } from "@uppy/core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

const documentFormSchema = z.object({
  name: z.string().min(1, "Document name is required"),
  propertyId: z.string().optional(),
  unitId: z.string().optional(),
  leaseId: z.string().optional(),
});

type DocumentFormData = z.infer<typeof documentFormSchema>;

interface DocumentUploadFormProps {
  children?: React.ReactNode;
}

export default function DocumentUploadForm({ children }: DocumentUploadFormProps) {
  const [open, setOpen] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [uploadedFileSize, setUploadedFileSize] = useState<number>(0);
  const [uploadedFileType, setUploadedFileType] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch properties for document association
  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
    retry: false,
  });

  // Fetch units for document association
  const { data: units } = useQuery({
    queryKey: ["/api/units"],
    retry: false,
  });

  // Fetch leases for document association
  const { data: leases } = useQuery({
    queryKey: ["/api/leases"],
    retry: false,
  });

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      name: "",
      propertyId: "none",
      unitId: "none",
      leaseId: "none",
    },
  });

  const saveDocumentMutation = useMutation({
    mutationFn: async (data: DocumentFormData) => {
      if (!uploadedFileUrl) {
        throw new Error("No file uploaded");
      }
      
      const submitData = {
        name: data.name,
        fileUrl: uploadedFileUrl,
        fileType: uploadedFileType,
        fileSize: uploadedFileSize,
        propertyId: data.propertyId === "none" ? undefined : data.propertyId,
        unitId: data.unitId === "none" ? undefined : data.unitId,
        leaseId: data.leaseId === "none" ? undefined : data.leaseId,
      };
      
      const response = await apiRequest("POST", "/api/documents", submitData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Success",
        description: "Document saved successfully",
      });
      setOpen(false);
      setUploadedFileUrl("");
      setUploadedFileName("");
      setUploadedFileSize(0);
      setUploadedFileType("");
      form.reset();
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
        description: "Failed to save document",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DocumentFormData) => {
    if (!uploadedFileUrl) {
      toast({
        title: "Error",
        description: "Please upload a file first",
        variant: "destructive",
      });
      return;
    }
    saveDocumentMutation.mutate(data);
  };

  const handleGetUploadParameters = async () => {
    const response = await apiRequest("POST", "/api/objects/upload");
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const file = result.successful[0];
      const fileUrl = file.uploadURL || "";
      const fileName = file.name || "";
      const fileSize = file.size || 0;
      const fileType = file.type || "";
      
      setUploadedFileUrl(fileUrl);
      setUploadedFileName(fileName);
      setUploadedFileSize(fileSize);
      setUploadedFileType(fileType);
      
      // Auto-fill the document name if not already set
      if (!form.getValues("name")) {
        form.setValue("name", fileName);
      }
      
      toast({
        title: "Success",
        description: "File uploaded successfully. Please fill out the form and save.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload File</label>
                <ObjectUploader
                  maxNumberOfFiles={1}
                  maxFileSize={50 * 1024 * 1024} // 50MB
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={handleUploadComplete}
                  buttonClassName="w-full"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Choose File to Upload</span>
                  </div>
                </ObjectUploader>
                {uploadedFileName && (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    ✓ Uploaded: {uploadedFileName} ({(uploadedFileSize / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter document name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated Property (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Property</SelectItem>
                      {properties && Array.isArray(properties) ? properties.map((property: any) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      )) : null}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated Unit (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Unit</SelectItem>
                      {units && Array.isArray(units) ? units.map((unit: any) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.property?.name || 'Property'} - Unit {unit.unitNumber}
                        </SelectItem>
                      )) : null}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leaseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated Lease (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lease" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Lease</SelectItem>
                      {leases && Array.isArray(leases) ? leases.map((lease: any) => (
                        <SelectItem key={lease.id} value={lease.id}>
                          Lease {lease.id.slice(-8)} - ${lease.monthlyRent}/month
                        </SelectItem>
                      )) : null}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saveDocumentMutation.isPending}>
                {saveDocumentMutation.isPending ? "Saving..." : "Save Document"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}