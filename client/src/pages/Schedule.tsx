import { useState } from "react";
import ScheduleGrid, { Employee } from "@/components/ScheduleGrid";
import { TimeBlockData } from "@/components/TimeBlock";
import EmployeeManager from "@/components/EmployeeManager";
import DateNavigator from "@/components/DateNavigator";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'emp1', name: 'Elvira', color: 'hsl(220 90% 56%)' },
    { id: 'emp2', name: 'Lidija', color: 'hsl(142 76% 36%)' },
  ]);

  const [blocks, setBlocks] = useState<TimeBlockData[]>([
    {
      id: 'block1',
      employeeId: 'emp1',
      startTime: '13:00',
      endTime: '14:30',
      task: 'Client Meeting',
    },
    {
      id: 'block2',
      employeeId: 'emp1',
      startTime: '14:00',
      endTime: '14:30',
      task: 'Hair Appointment',
    },
    {
      id: 'block3',
      employeeId: 'emp1',
      startTime: '16:00',
      endTime: '17:00',
      task: 'Consultation',
    },
    {
      id: 'block4',
      employeeId: 'emp2',
      startTime: '15:30',
      endTime: '16:30',
      task: 'Styling Session',
    },
  ]);

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
                  <EmployeeManager 
                    employees={employees}
                    onEmployeesChange={setEmployees}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ScheduleGrid 
          employees={employees}
          blocks={blocks}
          onBlocksChange={setBlocks}
          date={currentDate}
        />
      </main>
    </div>
  );
}
