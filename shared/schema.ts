import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  jsonb, 
  index,
  integer 
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - username/password auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  password: varchar("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Employee table
export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  color: varchar("color").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
});

export const updateEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  userId: true,
  createdAt: true,
}).partial();

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type UpdateEmployee = z.infer<typeof updateEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

// Time blocks table
export const timeBlocks = pgTable("time_blocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  employeeId: varchar("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  date: varchar("date").notNull(),
  startTime: varchar("start_time").notNull(),
  endTime: varchar("end_time").notNull(),
  clientName: varchar("client_name"),
  task: text("task"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTimeBlockSchema = createInsertSchema(timeBlocks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateTimeBlockSchema = createInsertSchema(timeBlocks).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export type InsertTimeBlock = z.infer<typeof insertTimeBlockSchema>;
export type UpdateTimeBlock = z.infer<typeof updateTimeBlockSchema>;
export type TimeBlock = typeof timeBlocks.$inferSelect;
