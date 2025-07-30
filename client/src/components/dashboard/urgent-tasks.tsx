import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Clock, MessageCircle } from "lucide-react";
import { MaintenanceRequest, Lease, Message } from "@shared/schema";

export default function UrgentTasks() {
  const { toast } = useToast();

  const { data: maintenanceRequests } = useQuery<MaintenanceRequest[]>({
    queryKey: ["/api/maintenance-requests"],
    retry: false,
  });

  const { data: leases } = useQuery<Lease[]>({
    queryKey: ["/api/leases"],
    retry: false,
  });

  const { data: messages } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    retry: false,
  });

  // Create urgent tasks from real data
  const urgentTasks = [];

  // Add urgent maintenance requests
  if (maintenanceRequests) {
    const urgentMaintenance = maintenanceRequests
      .filter(req => req.priority === 'urgent' && req.status === 'pending')
      .slice(0, 2)
      .map(req => ({
        id: req.id,
        title: req.title,
        description: req.description,
        type: 'maintenance' as const,
        priority: req.priority as 'urgent',
        timeAgo: getTimeAgo(req.createdAt!),
        icon: AlertTriangle,
        bgColor: 'bg-red-50 border-red-200',
        iconColor: 'text-red-500',
        textColor: 'text-red-900',
        descColor: 'text-red-700',
        timeColor: 'text-red-600',
      }));
    urgentTasks.push(...urgentMaintenance);
  }

  // Add expiring leases
  if (leases) {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const expiringLeases = leases
      .filter(lease => {
        const endDate = new Date(lease.endDate);
        return endDate <= thirtyDaysFromNow && endDate > now && lease.status === 'active';
      })
      .slice(0, 1)
      .map(lease => ({
        id: lease.id,
        title: 'Lease Renewal Due',
        description: `Unit ${lease.unitId.slice(-4)} - expires in ${Math.ceil((new Date(lease.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days`,
        type: 'lease' as const,
        priority: 'high' as const,
        timeAgo: 'Today',
        icon: Clock,
        bgColor: 'bg-amber-50 border-amber-200',
        iconColor: 'text-amber-500',
        textColor: 'text-amber-900',
        descColor: 'text-amber-700',
        timeColor: 'text-amber-600',
      }));
    urgentTasks.push(...expiringLeases);
  }

  // Add unread messages
  if (messages) {
    const unreadMessages = messages
      .filter(msg => msg.status === 'sent')
      .slice(0, 1)
      .map(msg => ({
        id: msg.id,
        title: 'New Message',
        description: msg.subject || msg.content.substring(0, 50) + '...',
        type: 'message' as const,
        priority: 'medium' as const,
        timeAgo: getTimeAgo(msg.createdAt!),
        icon: MessageCircle,
        bgColor: 'bg-blue-50 border-blue-200',
        iconColor: 'text-blue-500',
        textColor: 'text-blue-900',
        descColor: 'text-blue-700',
        timeColor: 'text-blue-600',
      }));
    urgentTasks.push(...unreadMessages);
  }

  function getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Urgent Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {urgentTasks.length > 0 ? (
          <div className="space-y-4">
            {urgentTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${task.bgColor}`}
              >
                <div className="flex-shrink-0">
                  <task.icon className={`h-4 w-4 ${task.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.textColor}`}>
                    {task.title}
                  </p>
                  <p className={`text-xs mt-1 ${task.descColor}`}>
                    {task.description}
                  </p>
                  <p className={`text-xs mt-1 ${task.timeColor}`}>
                    {task.timeAgo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No urgent tasks</p>
            <p className="text-xs text-gray-500 mt-1">All caught up!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
