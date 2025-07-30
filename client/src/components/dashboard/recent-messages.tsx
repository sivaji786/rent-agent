import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle } from "lucide-react";
import { Message } from "@shared/schema";

export default function RecentMessages() {
  const { toast } = useToast();

  const { data: messages, isLoading, error } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    retry: false,
  });

  if (error && isUnauthorizedError(error as Error)) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

  function getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Messages
          </CardTitle>
          <Button variant="ghost" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-2 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.slice(0, 3).map((message) => (
              <div key={message.id} className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {message.senderId.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    From: {message.senderId.slice(-8)}
                  </p>
                  <p className="text-xs text-gray-600 truncate mt-1">
                    {message.subject || message.content.substring(0, 60) + '...'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {getTimeAgo(message.createdAt!)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No recent messages</p>
            <p className="text-xs text-gray-500 mt-1">Messages will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
