import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Employee } from "./ScheduleGrid";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import EmployeeAvatar from "./EmployeeAvatar";
import { Card } from "@/components/ui/card";

interface EmployeeManagerProps {
  employees: Employee[];
  onEmployeesChange: (employees: Employee[]) => void;
}

const EMPLOYEE_COLORS = [
  'hsl(220 90% 56%)',
  'hsl(142 76% 36%)',
  'hsl(38 92% 50%)',
  'hsl(262 83% 58%)',
  'hsl(340 82% 52%)',
];

export default function EmployeeManager({ employees, onEmployeesChange }: EmployeeManagerProps) {
  const { t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState("");

  const handleAddEmployee = () => {
    if (!newEmployeeName.trim()) return;

    const colorIndex = employees.length % EMPLOYEE_COLORS.length;
    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      name: newEmployeeName,
      color: EMPLOYEE_COLORS[colorIndex],
    };

    onEmployeesChange([...employees, newEmployee]);
    setNewEmployeeName("");
    setIsDialogOpen(false);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    onEmployeesChange(employees.filter(e => e.id !== employeeId));
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t.employees.title}</h2>
          <Button size="sm" onClick={() => setIsDialogOpen(true)} data-testid="button-add-employee">
            <Plus className="h-4 w-4 mr-1" />
            {t.employees.add}
          </Button>
        </div>

        <div className="space-y-2">
          {employees.map(employee => (
            <Card key={employee.id} className="p-3 hover-elevate" data-testid={`employee-card-${employee.id}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <EmployeeAvatar name={employee.name} color={employee.color} />
                  <span className="text-sm font-medium">{employee.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDeleteEmployee(employee.id)}
                  data-testid={`button-delete-employee-${employee.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent data-testid="dialog-add-employee">
          <DialogHeader>
            <DialogTitle>{t.employees.addNew}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="employee-name">{t.employees.name}</Label>
              <Input
                id="employee-name"
                placeholder={t.employees.namePlaceholder}
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                data-testid="input-employee-name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel-employee">
              {t.employees.cancel}
            </Button>
            <Button onClick={handleAddEmployee} data-testid="button-confirm-employee">
              {t.employees.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
