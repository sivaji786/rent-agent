import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DocumentUploadForm from "@/components/forms/document-upload-form";
import { Document } from "@shared/schema";
import { FileText, Upload, Download, Folder, Image, FileCheck } from "lucide-react";

export default function Documents() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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

  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/documents"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes('image')) return Image;
    if (fileType?.includes('pdf')) return FileCheck;
    return FileText;
  };

  const getFileTypeColor = (fileType: string) => {
    if (fileType?.includes('image')) return 'bg-green-100 text-green-800';
    if (fileType?.includes('pdf')) return 'bg-red-100 text-red-800';
    if (fileType?.includes('document')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const documentList = Array.isArray(documents) ? documents as Document[] : [];

  const documentCategories = [
    {
      name: "Lease Agreements",
      count: documentList.filter((doc: Document) => doc.leaseId).length || 0,
      icon: FileCheck,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Property Documents",
      count: documentList.filter((doc: Document) => doc.propertyId && !doc.unitId && !doc.leaseId).length || 0,
      icon: Folder,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Unit Documents",
      count: documentList.filter((doc: Document) => doc.unitId && !doc.leaseId).length || 0,
      icon: FileText,
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "General Files",
      count: documentList.filter((doc: Document) => !doc.propertyId && !doc.unitId && !doc.leaseId).length || 0,
      icon: FileText,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
              <p className="text-sm text-gray-600 mt-1">Manage property-related documents and files</p>
            </div>
            <DocumentUploadForm />
          </div>

          {/* Document Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {documentCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{category.name}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{category.count}</p>
                    </div>
                    <div className={`p-3 ${category.color} rounded-lg`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Documents List */}
          <Card>
            <CardHeader>
              <CardTitle>All Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-48"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : documentList && documentList.length > 0 ? (
                <div className="space-y-4">
                  {documentList.map((document: Document) => {
                    const FileIcon = getFileIcon(document.fileType || '');
                    return (
                      <div
                        key={document.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{document.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span>Uploaded: {new Date(document.createdAt!).toLocaleDateString()}</span>
                              {document.fileSize && (
                                <span>Size: {formatFileSize(document.fileSize)}</span>
                              )}
                              <span>By: {document.uploadedBy?.slice(-8) || 'Unknown'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {document.fileType && (
                            <Badge className={getFileTypeColor(document.fileType)}>
                              {document.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                            </Badge>
                          )}
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                  <p className="text-gray-600 mb-4">Upload your first document to get started</p>
                  <DocumentUploadForm>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </DocumentUploadForm>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
