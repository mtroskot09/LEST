import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import ScheduleGrid from "@/components/ScheduleGrid";
import EmployeeManager from "@/components/EmployeeManager";
import DateNavigator from "@/components/DateNavigator";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Employee as DBEmployee, TimeBlock as DBTimeBlock } from "@shared/schema";

// Transform DB Employee to UI Employee
function transformEmployee(dbEmp: DBEmployee) {
  return {
    id: dbEmp.id,
    name: dbEmp.name,
    color: dbEmp.color,
  };
}

// Transform DB TimeBlock to UI TimeBlock
function transformTimeBlock(dbBlock: DBTimeBlock) {
  return {
    id: dbBlock.id,
    employeeId: dbBlock.employeeId,
    startTime: dbBlock.startTime,
    endTime: dbBlock.endTime,
    task: dbBlock.task || undefined,
  };
}

export default function Schedule() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const dateStr = format(currentDate, "yyyy-MM-dd");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  // Fetch employees
  const { data: dbEmployees = [] } = useQuery<DBEmployee[]>({
    queryKey: ["/api/employees"],
    enabled: isAuthenticated,
  });

  // Fetch time blocks
  const { data: dbTimeBlocks = [] } = useQuery<DBTimeBlock[]>({
    queryKey: ["/api/timeblocks", dateStr],
    enabled: isAuthenticated,
  });

  // Employee mutations
  const createEmployeeMutation = useMutation({
    mutationFn: async (data: { name: string; color: string; displayOrder: number }) => {
      return await apiRequest("/api/employees", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create employee",
        variant: "destructive",
      });
    },
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/employees/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      queryClient.invalidateQueries({ queryKey: ["/api/timeblocks"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      });
    },
  });

  // Time block mutations
  const createBlockMutation = useMutation({
    mutationFn: async (data: {
      employeeId: string;
      date: string;
      startTime: string;
      endTime: string;
      task?: string;
    }) => {
      return await apiRequest("/api/timeblocks", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/timeblocks", dateStr] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create time block",
        variant: "destructive",
      });
    },
  });

  const updateBlockMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DBTimeBlock> }) => {
      return await apiRequest(`/api/timeblocks/${id}`, "PATCH", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/timeblocks", dateStr] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update time block",
        variant: "destructive",
      });
    },
  });

  const deleteBlockMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/timeblocks/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/timeblocks", dateStr] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to delete time block",
        variant: "destructive",
      });
    },
  });

  const employees = dbEmployees.map(transformEmployee);
  const blocks = dbTimeBlocks.map(transformTimeBlock);

  const handleEmployeesChange = (newEmployees: typeof employees) => {
    const currentIds = new Set(employees.map(e => e.id));
    const newIds = new Set(newEmployees.map(e => e.id));
    
    // Find added employees
    const added = newEmployees.filter(e => !currentIds.has(e.id));
    added.forEach((emp, idx) => {
      createEmployeeMutation.mutate({
        name: emp.name,
        color: emp.color,
        displayOrder: dbEmployees.length + idx,
      });
    });

    // Find deleted employees
    const deleted = employees.filter(e => !newIds.has(e.id));
    deleted.forEach(emp => {
      deleteEmployeeMutation.mutate(emp.id);
    });
  };

  const handleBlocksChange = (newBlocks: Array<{
    id: string;
    employeeId: string;
    startTime: string;
    endTime: string;
    task?: string;
  }>) => {
    const currentIds = new Set(blocks.map(b => b.id));
    const newIds = new Set(newBlocks.map(b => b.id));

    // Find added blocks
    const added = newBlocks.filter(b => !currentIds.has(b.id));
    added.forEach(block => {
      createBlockMutation.mutate({
        employeeId: block.employeeId,
        date: dateStr,
        startTime: block.startTime,
        endTime: block.endTime,
        task: block.task,
      });
    });

    // Find deleted blocks
    const deleted = blocks.filter(b => !newIds.has(b.id));
    deleted.forEach(block => {
      deleteBlockMutation.mutate(block.id);
    });

    // Find updated blocks (changed employee or time)
    const updated = newBlocks.filter(newBlock => {
      const oldBlock = blocks.find(b => b.id === newBlock.id);
      return oldBlock && (
        oldBlock.employeeId !== newBlock.employeeId ||
        oldBlock.startTime !== newBlock.startTime ||
        oldBlock.endTime !== newBlock.endTime ||
        oldBlock.task !== newBlock.task
      );
    });
    updated.forEach(block => {
      updateBlockMutation.mutate({
        id: block.id,
        data: {
          employeeId: block.employeeId,
          startTime: block.startTime,
          endTime: block.endTime,
          task: block.task || null,
        },
      });
    });
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const userInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"
    : "U";

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Schedule Manager</h1>
          </div>

          <div className="flex items-center gap-2">
            <DateNavigator date={currentDate} onDateChange={setCurrentDate} />

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" data-testid="button-manage-employees">
                  <Users className="h-4 w-4 mr-1" />
                  Employees
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Manage Employees</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <EmployeeManager employees={employees} onEmployeesChange={handleEmployeesChange} />
                </div>
              </SheetContent>
            </Sheet>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-user-menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || undefined} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ScheduleGrid employees={employees} blocks={blocks} onBlocksChange={handleBlocksChange} date={currentDate} />
      </main>
    </div>
  );
}
