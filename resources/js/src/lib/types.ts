// TypeScript types for the Laravel API responses
// These match the structure returned by Laravel controllers

export type User = {
  id: string;
  username: string;
  name: string;
};

export type InsertUser = {
  username: string;
  password: string;
};

export type Employee = {
  id: string;
  name: string;
  color: string;
  display_order: number;
  company_id?: string;
};

export type TimeBlock = {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  clientName?: string | null;
  task?: string | null;
};
