import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart3, 
  Building, 
  Users, 
  DollarSign, 
  Wrench, 
  MessageCircle, 
  FileText, 
  Settings,
  Home
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: BarChart3,
      badge: null,
    },
    {
      name: "Properties",
      href: "/properties",
      icon: Building,
      badge: stats?.totalUnits || null,
    },
    {
      name: "Tenants",
      href: "/tenants",
      icon: Users,
      badge: null,
    },
    {
      name: "Financials",
      href: "/financials",
      icon: DollarSign,
      badge: null,
    },
    {
      name: "Maintenance",
      href: "/maintenance",
      icon: Wrench,
      badge: stats?.pendingMaintenance > 0 ? stats.pendingMaintenance : null,
      badgeVariant: "destructive" as const,
    },
    {
      name: "Communication",
      href: "/communication",
      icon: MessageCircle,
      badge: stats?.unreadMessages > 0 ? stats.unreadMessages : null,
      badgeVariant: "destructive" as const,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: FileText,
      badge: null,
    },
    {
      name: "Documents",
      href: "/documents",
      icon: Home,
      badge: null,
    },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Building className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Prolits</span>
        </div>
      </div>

      {/* User Profile */}
      {user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profileImageUrl || ""} />
              <AvatarFallback>
                {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {user.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
                {item.badge && (
                  <Badge 
                    variant={item.badgeVariant || "secondary"} 
                    className="ml-auto text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200">
        <Link href="/settings">
          <a className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </a>
        </Link>
      </div>
    </div>
  );
}
