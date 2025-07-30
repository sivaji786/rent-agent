import {
  users,
  properties,
  units,
  leases,
  payments,
  maintenanceRequests,
  messages,
  documents,
  type User,
  type UpsertUser,
  type Property,
  type InsertProperty,
  type Unit,
  type InsertUnit,
  type Lease,
  type InsertLease,
  type Payment,
  type InsertPayment,
  type MaintenanceRequest,
  type InsertMaintenanceRequest,
  type Message,
  type InsertMessage,
  type Document,
  type InsertDocument,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: any): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;

  // Property operations
  getProperties(): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property>;
  deleteProperty(id: string): Promise<void>;
  getPropertiesByOwner(ownerId: string): Promise<Property[]>;
  getPropertiesByManager(managerId: string): Promise<Property[]>;

  // Unit operations
  getUnits(): Promise<Unit[]>;
  getUnit(id: string): Promise<Unit | undefined>;
  getUnitsByProperty(propertyId: string): Promise<Unit[]>;
  createUnit(unit: InsertUnit): Promise<Unit>;
  updateUnit(id: string, unit: Partial<InsertUnit>): Promise<Unit>;
  deleteUnit(id: string): Promise<void>;

  // Lease operations
  getLeases(): Promise<Lease[]>;
  getLease(id: string): Promise<Lease | undefined>;
  getLeasesByTenant(tenantId: string): Promise<Lease[]>;
  getLeasesByUnit(unitId: string): Promise<Lease[]>;
  createLease(lease: InsertLease): Promise<Lease>;
  updateLease(id: string, lease: Partial<InsertLease>): Promise<Lease>;
  deleteLease(id: string): Promise<void>;

  // Payment operations
  getPayments(): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentsByLease(leaseId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;

  // Maintenance request operations
  getMaintenanceRequests(): Promise<MaintenanceRequest[]>;
  getMaintenanceRequest(id: string): Promise<MaintenanceRequest | undefined>;
  getMaintenanceRequestsByUnit(unitId: string): Promise<MaintenanceRequest[]>;
  getMaintenanceRequestsByTenant(tenantId: string): Promise<MaintenanceRequest[]>;
  createMaintenanceRequest(request: InsertMaintenanceRequest): Promise<MaintenanceRequest>;
  updateMaintenanceRequest(id: string, request: Partial<InsertMaintenanceRequest>): Promise<MaintenanceRequest>;
  deleteMaintenanceRequest(id: string): Promise<void>;

  // Message operations
  getMessages(): Promise<Message[]>;
  getMessage(id: string): Promise<Message | undefined>;
  getMessagesByUser(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: string, message: Partial<InsertMessage>): Promise<Message>;

  // Document operations
  getDocuments(): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  getDocumentsByProperty(propertyId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  deleteDocument(id: string): Promise<void>;

  // Dashboard statistics
  getDashboardStats(userId: string, userRole: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createUser(userData: any): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role as any));
  }

  // Property operations
  async getProperties(): Promise<Property[]> {
    return await db.select().from(properties).orderBy(desc(properties.createdAt));
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property> {
    const [updatedProperty] = await db
      .update(properties)
      .set({ ...property, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty;
  }

  async deleteProperty(id: string): Promise<void> {
    await db.delete(properties).where(eq(properties.id, id));
  }

  async getPropertiesByOwner(ownerId: string): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.ownerId, ownerId));
  }

  async getPropertiesByManager(managerId: string): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.managerId, managerId));
  }

  // Unit operations
  async getUnits(): Promise<Unit[]> {
    return await db.select().from(units).orderBy(desc(units.createdAt));
  }

  async getUnit(id: string): Promise<Unit | undefined> {
    const [unit] = await db.select().from(units).where(eq(units.id, id));
    return unit;
  }

  async getUnitsByProperty(propertyId: string): Promise<Unit[]> {
    return await db.select().from(units).where(eq(units.propertyId, propertyId));
  }

  async createUnit(unit: InsertUnit): Promise<Unit> {
    const [newUnit] = await db.insert(units).values(unit).returning();
    return newUnit;
  }

  async updateUnit(id: string, unit: Partial<InsertUnit>): Promise<Unit> {
    const [updatedUnit] = await db
      .update(units)
      .set({ ...unit, updatedAt: new Date() })
      .where(eq(units.id, id))
      .returning();
    return updatedUnit;
  }

  async deleteUnit(id: string): Promise<void> {
    await db.delete(units).where(eq(units.id, id));
  }

  // Lease operations
  async getLeases(): Promise<Lease[]> {
    return await db.select().from(leases).orderBy(desc(leases.createdAt));
  }

  async getLease(id: string): Promise<Lease | undefined> {
    const [lease] = await db.select().from(leases).where(eq(leases.id, id));
    return lease;
  }

  async getLeasesByTenant(tenantId: string): Promise<Lease[]> {
    return await db.select().from(leases).where(eq(leases.tenantId, tenantId));
  }

  async getLeasesByUnit(unitId: string): Promise<Lease[]> {
    return await db.select().from(leases).where(eq(leases.unitId, unitId));
  }

  async createLease(lease: InsertLease): Promise<Lease> {
    const [newLease] = await db.insert(leases).values(lease).returning();
    return newLease;
  }

  async updateLease(id: string, lease: Partial<InsertLease>): Promise<Lease> {
    const [updatedLease] = await db
      .update(leases)
      .set({ ...lease, updatedAt: new Date() })
      .where(eq(leases.id, id))
      .returning();
    return updatedLease;
  }

  async deleteLease(id: string): Promise<void> {
    await db.delete(leases).where(eq(leases.id, id));
  }

  // Payment operations
  async getPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async getPaymentsByLease(leaseId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.leaseId, leaseId));
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  // Maintenance request operations
  async getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    return await db.select().from(maintenanceRequests).orderBy(desc(maintenanceRequests.createdAt));
  }

  async getMaintenanceRequest(id: string): Promise<MaintenanceRequest | undefined> {
    const [request] = await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.id, id));
    return request;
  }

  async getMaintenanceRequestsByUnit(unitId: string): Promise<MaintenanceRequest[]> {
    return await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.unitId, unitId));
  }

  async getMaintenanceRequestsByTenant(tenantId: string): Promise<MaintenanceRequest[]> {
    return await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.tenantId, tenantId));
  }

  async createMaintenanceRequest(request: InsertMaintenanceRequest): Promise<MaintenanceRequest> {
    const [newRequest] = await db.insert(maintenanceRequests).values(request).returning();
    return newRequest;
  }

  async updateMaintenanceRequest(id: string, request: Partial<InsertMaintenanceRequest>): Promise<MaintenanceRequest> {
    const [updatedRequest] = await db
      .update(maintenanceRequests)
      .set({ ...request, updatedAt: new Date() })
      .where(eq(maintenanceRequests.id, id))
      .returning();
    return updatedRequest;
  }

  async deleteMaintenanceRequest(id: string): Promise<void> {
    await db.delete(maintenanceRequests).where(eq(maintenanceRequests.id, id));
  }

  // Message operations
  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  async getMessage(id: string): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }

  async getMessagesByUser(userId: string): Promise<Message[]> {
    return await db.select().from(messages).where(
      or(eq(messages.senderId, userId), eq(messages.receiverId, userId))
    ).orderBy(desc(messages.createdAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async updateMessage(id: string, message: Partial<InsertMessage>): Promise<Message> {
    const [updatedMessage] = await db
      .update(messages)
      .set({ ...message, updatedAt: new Date() })
      .where(eq(messages.id, id))
      .returning();
    return updatedMessage;
  }

  // Document operations
  async getDocuments(): Promise<Document[]> {
    return await db.select().from(documents).orderBy(desc(documents.createdAt));
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }

  async getDocumentsByProperty(propertyId: string): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.propertyId, propertyId));
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db.insert(documents).values(document).returning();
    return newDocument;
  }

  async deleteDocument(id: string): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  // Dashboard statistics
  async getDashboardStats(userId: string, userRole: string): Promise<any> {
    // Get total revenue from payments
    const revenueResult = await db
      .select({ total: sql<number>`sum(${payments.amount})` })
      .from(payments);
    
    // Get occupied units count
    const occupiedUnitsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(units)
      .where(eq(units.isOccupied, true));

    // Get total units count
    const totalUnitsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(units);

    // Get pending maintenance requests count
    const maintenanceResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(maintenanceRequests)
      .where(eq(maintenanceRequests.status, "pending"));

    // Get unread messages count
    const messagesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(and(
        eq(messages.receiverId, userId),
        eq(messages.status, "sent")
      ));

    return {
      totalRevenue: revenueResult[0]?.total || 0,
      occupiedUnits: occupiedUnitsResult[0]?.count || 0,
      totalUnits: totalUnitsResult[0]?.count || 0,
      pendingMaintenance: maintenanceResult[0]?.count || 0,
      unreadMessages: messagesResult[0]?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
