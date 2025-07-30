import { Property, User, MaintenanceRequest, Message, Payment, Lease } from "@shared/schema";

export interface DashboardStats {
  totalRevenue: number;
  occupiedUnits: number;
  totalUnits: number;
  pendingMaintenance: number;
  unreadMessages: number;
}

export interface PropertyWithUnits extends Property {
  units?: {
    id: string;
    unitNumber: string;
    isOccupied: boolean;
    monthlyRent?: string;
  }[];
  occupancyRate?: number;
  monthlyRevenue?: number;
}

export interface UserWithRole extends User {
  displayName: string;
}

export interface UrgentTask {
  id: string;
  title: string;
  description: string;
  type: 'maintenance' | 'lease' | 'message' | 'payment';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timeAgo: string;
  actionRequired?: boolean;
}

export interface AIInsight {
  id: string;
  type: 'revenue' | 'maintenance' | 'tenant_retention' | 'occupancy';
  title: string;
  description: string;
  icon: string;
  confidence: number;
  actionable: boolean;
}

export interface QuickActionType {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
}
