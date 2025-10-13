import {
  users,
  employees,
  timeBlocks,
  type User,
  type InsertUser,
  type Employee,
  type InsertEmployee,
  type UpdateEmployee,
  type TimeBlock,
  type InsertTimeBlock,
  type UpdateTimeBlock,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Employee operations
  getEmployeesByUser(userId: string): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employee: UpdateEmployee): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<void>;
  
  // Time block operations
  getTimeBlocksByUserAndDate(userId: string, date: string): Promise<TimeBlock[]>;
  getTimeBlock(id: string): Promise<TimeBlock | undefined>;
  createTimeBlock(block: InsertTimeBlock): Promise<TimeBlock>;
  updateTimeBlock(id: string, block: UpdateTimeBlock): Promise<TimeBlock | undefined>;
  deleteTimeBlock(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  // Employee operations
  async getEmployeesByUser(userId: string): Promise<Employee[]> {
    return await db
      .select()
      .from(employees)
      .where(eq(employees.userId, userId))
      .orderBy(employees.displayOrder);
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee;
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const [newEmployee] = await db.insert(employees).values(employee).returning();
    return newEmployee;
  }

  async updateEmployee(id: string, employee: UpdateEmployee): Promise<Employee | undefined> {
    const [updated] = await db
      .update(employees)
      .set(employee)
      .where(eq(employees.id, id))
      .returning();
    return updated;
  }

  async deleteEmployee(id: string): Promise<void> {
    await db.delete(employees).where(eq(employees.id, id));
  }

  // Time block operations
  async getTimeBlocksByUserAndDate(userId: string, date: string): Promise<TimeBlock[]> {
    return await db
      .select()
      .from(timeBlocks)
      .where(and(eq(timeBlocks.userId, userId), eq(timeBlocks.date, date)));
  }

  async getTimeBlock(id: string): Promise<TimeBlock | undefined> {
    const [block] = await db.select().from(timeBlocks).where(eq(timeBlocks.id, id));
    return block;
  }

  async createTimeBlock(block: InsertTimeBlock): Promise<TimeBlock> {
    const [newBlock] = await db.insert(timeBlocks).values(block).returning();
    return newBlock;
  }

  async updateTimeBlock(id: string, block: UpdateTimeBlock): Promise<TimeBlock | undefined> {
    const [updated] = await db
      .update(timeBlocks)
      .set({ ...block, updatedAt: new Date() })
      .where(eq(timeBlocks.id, id))
      .returning();
    return updated;
  }

  async deleteTimeBlock(id: string): Promise<void> {
    await db.delete(timeBlocks).where(eq(timeBlocks.id, id));
  }
}

export const storage = new DatabaseStorage();
