import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { 
  insertEmployeeSchema, 
  updateEmployeeSchema,
  insertTimeBlockSchema,
  updateTimeBlockSchema,
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Employee routes
  app.get("/api/employees", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const employees = await storage.getEmployeesByUser(userId);
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.post("/api/employees", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validation = insertEmployeeSchema.safeParse({ ...req.body, userId });
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: fromZodError(validation.error).message 
        });
      }

      const employee = await storage.createEmployee(validation.data);
      res.json(employee);
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ message: "Failed to create employee" });
    }
  });

  app.patch("/api/employees/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Verify ownership
      const existing = await storage.getEmployee(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Validate update payload (excludes userId to prevent reassignment)
      const validation = updateEmployeeSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: fromZodError(validation.error).message 
        });
      }

      const employee = await storage.updateEmployee(id, validation.data);
      res.json(employee);
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Failed to update employee" });
    }
  });

  app.delete("/api/employees/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const existing = await storage.getEmployee(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Employee not found" });
      }

      await storage.deleteEmployee(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });

  // Time block routes
  app.get("/api/timeblocks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { date } = req.query;
      
      if (!date) {
        return res.status(400).json({ message: "Date parameter is required" });
      }

      const blocks = await storage.getTimeBlocksByUserAndDate(userId, date as string);
      res.json(blocks);
    } catch (error) {
      console.error("Error fetching time blocks:", error);
      res.status(500).json({ message: "Failed to fetch time blocks" });
    }
  });

  app.post("/api/timeblocks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validation = insertTimeBlockSchema.safeParse({ ...req.body, userId });
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: fromZodError(validation.error).message 
        });
      }

      const block = await storage.createTimeBlock(validation.data);
      res.json(block);
    } catch (error) {
      console.error("Error creating time block:", error);
      res.status(500).json({ message: "Failed to create time block" });
    }
  });

  app.patch("/api/timeblocks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Verify ownership
      const existing = await storage.getTimeBlock(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Time block not found" });
      }

      // If employeeId is being changed, verify the target employee belongs to user
      if (req.body.employeeId && req.body.employeeId !== existing.employeeId) {
        const targetEmployee = await storage.getEmployee(req.body.employeeId);
        if (!targetEmployee || targetEmployee.userId !== userId) {
          return res.status(403).json({ message: "Cannot transfer to employee from another user" });
        }
      }

      // Validate update payload (excludes userId to prevent reassignment)
      const validation = updateTimeBlockSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: fromZodError(validation.error).message 
        });
      }

      const block = await storage.updateTimeBlock(id, validation.data);
      res.json(block);
    } catch (error) {
      console.error("Error updating time block:", error);
      res.status(500).json({ message: "Failed to update time block" });
    }
  });

  app.delete("/api/timeblocks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const existing = await storage.getTimeBlock(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Time block not found" });
      }

      await storage.deleteTimeBlock(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting time block:", error);
      res.status(500).json({ message: "Failed to delete time block" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
