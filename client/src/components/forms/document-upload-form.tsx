import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertDocumentSchema, type InsertDocument } from "@shared/schema";
import { z } from "zod";

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
  onSuccess?: () => void;
}

export default function DocumentUploadForm({ children, onSuccess }: DocumentUploadFormProps) {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [uploadedFileSize, setUploadedFileSize] = useState<number>(0);
  const [uploadedFileType, setUploadedFileType] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
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
      setUploadedFileUrl("");
      setUploadedFileName("");
      setUploadedFileSize(0);
      setUploadedFileType("");
      form.reset();
      onSuccess?.();
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



  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 50MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Get upload URL
      const response = await apiRequest("POST", "/api/objects/upload");
      const data = await response.json();
      
      // Upload file directly to storage
      const uploadResponse = await fetch(data.uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      // Set uploaded file info
      setUploadedFileUrl(data.uploadURL.split('?')[0]); // Remove query parameters
      setUploadedFileName(file.name);
      setUploadedFileSize(file.size);
      setUploadedFileType(file.type);
      
      // Auto-fill the document name if not already set
      if (!form.getValues("name")) {
        form.setValue("name", file.name);
      }
      
      toast({
        title: "Success",
        description: "File uploaded successfully. Please fill out the form and save.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`cursor-pointer inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                      isUploading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Choose File to Upload'}
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Select PDF, Word documents, images, or text files (max 50MB)
                  </p>
                </div>
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
              <Button type="submit" disabled={saveDocumentMutation.isPending} className="w-full">
                {saveDocumentMutation.isPending ? "Saving..." : "Save Document"}
              </Button>
            </div>
          </form>
        </Form>
  );
}