import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import TimeBlock, { TimeBlockData } from "./TimeBlock";
import EmployeeAvatar from "./EmployeeAvatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export interface Employee {
  id: string;
  name: string;
  color: string;
}

interface ScheduleGridProps {
  employees: Employee[];
  blocks: TimeBlockData[];
  onBlocksChange: (blocks: TimeBlockData[]) => void;
  date: Date;
}

export default function ScheduleGrid({ employees, blocks, onBlocksChange, date }: ScheduleGridProps) {
  const { t } = useLanguage();
  const [draggedBlock, setDraggedBlock] = useState<TimeBlockData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [newBlockData, setNewBlockData] = useState({ startTime: "", endTime: "", task: "" });

  const timeSlots = [];
  for (let hour = 9; hour <= 19; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  const handleDragStart = (block: TimeBlockData) => {
    setDraggedBlock(block);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (employeeId: string, timeSlot: string) => {
    if (!draggedBlock) return;

    const updatedBlocks = blocks.map(block => {
      if (block.id === draggedBlock.id) {
        return { ...block, employeeId, startTime: timeSlot };
      }
      return block;
    });

    onBlocksChange(updatedBlocks);
    setDraggedBlock(null);
  };

  const handleDeleteBlock = (blockId: string) => {
    onBlocksChange(blocks.filter(b => b.id !== blockId));
  };

  const handleCellClick = (employeeId: string, timeSlot: string) => {
    setSelectedEmployee(employeeId);
    setSelectedTime(timeSlot);
    setNewBlockData({ startTime: timeSlot, endTime: "", task: "" });
    setIsDialogOpen(true);
  };

  const handleCreateBlock = () => {
    if (!newBlockData.startTime || !newBlockData.endTime) return;

    const newBlock: TimeBlockData = {
      id: `block-${Date.now()}`,
      employeeId: selectedEmployee,
      startTime: newBlockData.startTime,
      endTime: newBlockData.endTime,
      task: newBlockData.task,
    };

    onBlocksChange([...blocks, newBlock]);
    setIsDialogOpen(false);
    setNewBlockData({ startTime: "", endTime: "", task: "" });
  };

  const getBlocksForCell = (employeeId: string, timeSlot: string) => {
    return blocks.filter(
      block => block.employeeId === employeeId && block.startTime === timeSlot
    );
  };

  return (
    <>
      <div className="overflow-auto">
        <div className="inline-block min-w-full">
          <div className="flex">
            <div className="w-20 flex-shrink-0 sticky left-0 bg-background z-10">
              <div className="h-12 border-b flex items-center px-2">
                <span className="text-xs font-medium text-muted-foreground">{t.time}</span>
              </div>
            </div>

            {employees.map(employee => (
              <div key={employee.id} className="flex-1 min-w-[200px]">
                <div className="h-12 border-b border-l px-4 flex items-center gap-2 bg-card">
                  <EmployeeAvatar name={employee.name} color={employee.color} />
                  <span className="text-sm font-medium">{employee.name}</span>
                </div>
              </div>
            ))}
          </div>

          {timeSlots.map((timeSlot, idx) => (
            <div key={timeSlot} className="flex">
              <div className="w-20 flex-shrink-0 sticky left-0 bg-background z-10 border-b px-2 py-2">
                <span className="text-xs text-muted-foreground">{timeSlot}</span>
              </div>

              {employees.map(employee => {
                const cellBlocks = getBlocksForCell(employee.id, timeSlot);
                
                return (
                  <div
                    key={`${employee.id}-${timeSlot}`}
                    className="flex-1 min-w-[200px] border-b border-l p-1 min-h-[60px] hover-elevate cursor-pointer relative"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(employee.id, timeSlot)}
                    onClick={() => handleCellClick(employee.id, timeSlot)}
                    data-testid={`cell-${employee.id}-${timeSlot}`}
                  >
                    {cellBlocks.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    {cellBlocks.map(block => (
                      <TimeBlock
                        key={block.id}
                        block={block}
                        color={employee.color}
                        onDragStart={() => handleDragStart(block)}
                        onDelete={() => handleDeleteBlock(block.id)}
                        isDragging={draggedBlock?.id === block.id}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent data-testid="dialog-create-block">
          <DialogHeader>
            <DialogTitle>{t.timeBlock.add}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="start-time">{t.timeBlock.startTime}</Label>
              <Input
                id="start-time"
                type="time"
                value={newBlockData.startTime}
                onChange={(e) => setNewBlockData({ ...newBlockData, startTime: e.target.value })}
                data-testid="input-start-time"
              />
            </div>
            <div>
              <Label htmlFor="end-time">{t.timeBlock.endTime}</Label>
              <Input
                id="end-time"
                type="time"
                value={newBlockData.endTime}
                onChange={(e) => setNewBlockData({ ...newBlockData, endTime: e.target.value })}
                data-testid="input-end-time"
              />
            </div>
            <div>
              <Label htmlFor="task">{t.timeBlock.task}</Label>
              <Input
                id="task"
                placeholder={t.timeBlock.taskPlaceholder}
                value={newBlockData.task}
                onChange={(e) => setNewBlockData({ ...newBlockData, task: e.target.value })}
                data-testid="input-task"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
              {t.timeBlock.cancel}
            </Button>
            <Button onClick={handleCreateBlock} data-testid="button-create">
              {t.timeBlock.create}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
