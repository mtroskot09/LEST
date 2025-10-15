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
  const [dragOverCell, setDragOverCell] = useState<{employeeId: string, timeSlot: string} | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [newBlockData, setNewBlockData] = useState({ startTime: "", endTime: "", task: "", clientName: "" });
  const [editingBlock, setEditingBlock] = useState<TimeBlockData | null>(null);

  const timeSlots = [];
  for (let hour = 9; hour <= 19; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:15`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:45`);
  }

  const handleDragStart = (block: TimeBlockData) => {
    setDraggedBlock(block);
  };

  const handleDragOver = (e: React.DragEvent, employeeId: string, timeSlot: string) => {
    e.preventDefault();
    setDragOverCell({ employeeId, timeSlot });
  };

  const handleDrop = (employeeId: string, timeSlot: string) => {
    if (!draggedBlock) return;

    // Calculate the duration of the dragged block
    const duration = calculateDuration(draggedBlock.startTime, draggedBlock.endTime);
    
    // Calculate the new end time based on the new start time
    const newStartMinutes = getMinutesFromTime(timeSlot);
    const newEndMinutes = newStartMinutes + duration;
    
    // Convert back to time format
    const newEndTime = `${Math.floor(newEndMinutes / 60).toString().padStart(2, '0')}:${(newEndMinutes % 60).toString().padStart(2, '0')}`;
    
    // Validate that the new start time is at a valid 15-minute increment
    if (!validateTimeSlot(timeSlot)) {
      alert(t.messages?.invalidStartTime || "Start time must be at :00, :15, :30, or :45");
      setDraggedBlock(null);
      return;
    }
    
    // Validate that the new end time is at a valid 15-minute increment
    if (!validateTimeSlot(newEndTime)) {
      alert(t.messages?.invalidEndTime || "End time must be at :00, :15, :30, or :45");
      setDraggedBlock(null);
      return;
    }
    
    // Check for conflicts (excluding the current block)
    if (hasTimeConflict(employeeId, timeSlot, newEndTime, draggedBlock.id)) {
      alert(t.messages?.timeConflict || "This time slot conflicts with an existing appointment");
      setDraggedBlock(null);
      return;
    }
    
    // Check if the new time slot is within business hours (9:00-19:00)
    const startHour = parseInt(timeSlot.split(':')[0]);
    const endHour = parseInt(newEndTime.split(':')[0]);
    if (startHour < 9 || endHour > 19) {
      alert(t.messages?.outsideHours || "Appointments must be within business hours (9:00-19:00)");
      setDraggedBlock(null);
      return;
    }

    // Update the block with new position and times
    const updatedBlocks = blocks.map(block => {
      if (block.id === draggedBlock.id) {
        return { 
          ...block, 
          employeeId, 
          startTime: timeSlot,
          endTime: newEndTime
        };
      }
      return block;
    });

    onBlocksChange(updatedBlocks);
    setDraggedBlock(null);
    setDragOverCell(null);
  };

  const handleDeleteBlock = (blockId: string) => {
    onBlocksChange(blocks.filter(b => b.id !== blockId));
  };

  const handleEditBlock = (block: TimeBlockData) => {
    setEditingBlock(block);
    setNewBlockData({
      startTime: block.startTime,
      endTime: block.endTime,
      task: block.task || "",
      clientName: block.clientName || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateBlock = () => {
    if (!editingBlock) return;

    // Validate the same way as creating a new block
    if (!validateTimeSlot(newBlockData.startTime)) {
      alert(t.messages?.invalidStartTime || "Start time must be at :00, :15, :30, or :45");
      return;
    }

    if (!validateTimeSlot(newBlockData.endTime)) {
      alert(t.messages?.invalidEndTime || "End time must be at :00, :15, :30, or :45");
      return;
    }

    const duration = calculateDuration(newBlockData.startTime, newBlockData.endTime);
    if (duration < 15) {
      alert(t.messages?.minimumDuration || "Minimum duration is 15 minutes");
      return;
    }

    if (duration <= 0) {
      alert(t.messages?.invalidDuration || "End time must be after start time");
      return;
    }

    // Check for conflicts (excluding the current block being edited)
    if (hasTimeConflict(editingBlock.employeeId, newBlockData.startTime, newBlockData.endTime, editingBlock.id)) {
      alert(t.messages?.timeConflict || "This time slot conflicts with an existing appointment");
      return;
    }

    // Update the block
    const updatedBlocks = blocks.map(block => {
      if (block.id === editingBlock.id) {
        return {
          ...block,
          startTime: newBlockData.startTime,
          endTime: newBlockData.endTime,
          task: newBlockData.task,
          clientName: newBlockData.clientName,
        };
      }
      return block;
    });

    onBlocksChange(updatedBlocks);
    setIsEditDialogOpen(false);
    setEditingBlock(null);
    setNewBlockData({ startTime: "", endTime: "", task: "", clientName: "" });
  };

  const getBlocksForCell = (employeeId: string, timeSlot: string) => {
    return blocks.filter(block => {
      if (block.employeeId !== employeeId) return false;
      
      // Check if this time slot is within the block's duration
      const blockStartMinutes = getMinutesFromTime(block.startTime);
      const blockEndMinutes = getMinutesFromTime(block.endTime);
      const slotMinutes = getMinutesFromTime(timeSlot);
      
      return slotMinutes >= blockStartMinutes && slotMinutes < blockEndMinutes;
    });
  };


  const getMinutesFromTime = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleCellClick = (employeeId: string, timeSlot: string) => {
    // Check if this cell is already occupied
    const existingBlocks = getBlocksForCell(employeeId, timeSlot);
    if (existingBlocks.length > 0) {
      // Don't allow creating new blocks on occupied cells
      return;
    }

    setSelectedEmployee(employeeId);
    setSelectedTime(timeSlot);
    setNewBlockData({ startTime: timeSlot, endTime: "", task: "", clientName: "" });
    setIsDialogOpen(true);
  };

  const validateTimeSlot = (time: string): boolean => {
    const [hours, minutes] = time.split(':').map(Number);
    return minutes === 0 || minutes === 15 || minutes === 30 || minutes === 45;
  };

  const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return endMinutes - startMinutes;
  };

  const handleCreateBlock = () => {
    if (!newBlockData.startTime || !newBlockData.endTime) return;

    // Validate start time
    if (!validateTimeSlot(newBlockData.startTime)) {
      alert(t.messages?.invalidStartTime || "Start time must be at :00, :15, :30, or :45");
      return;
    }

    // Validate end time
    if (!validateTimeSlot(newBlockData.endTime)) {
      alert(t.messages?.invalidEndTime || "End time must be at :00, :15, :30, or :45");
      return;
    }

    // Calculate duration
    const duration = calculateDuration(newBlockData.startTime, newBlockData.endTime);
    
    // Validate minimum duration (15 minutes)
    if (duration < 15) {
      alert(t.messages?.minimumDuration || "Minimum duration is 15 minutes");
      return;
    }

    // Validate that end time is after start time
    if (duration <= 0) {
      alert(t.messages?.invalidDuration || "End time must be after start time");
      return;
    }

    // Check for time conflicts
    if (hasTimeConflict(selectedEmployee, newBlockData.startTime, newBlockData.endTime)) {
      alert(t.messages?.timeConflict || "This time slot conflicts with an existing appointment");
      return;
    }

    const newBlock: TimeBlockData = {
      id: `block-${Date.now()}`,
      employeeId: selectedEmployee,
      startTime: newBlockData.startTime,
      endTime: newBlockData.endTime,
      task: newBlockData.task,
      clientName: newBlockData.clientName,
    };

    onBlocksChange([...blocks, newBlock]);
    setIsDialogOpen(false);
    setNewBlockData({ startTime: "", endTime: "", task: "", clientName: "" });
  };

  const isBlockStart = (block: TimeBlockData, timeSlot: string): boolean => {
    return block.startTime === timeSlot;
  };

  const hasTimeConflict = (employeeId: string, startTime: string, endTime: string, excludeBlockId?: string): boolean => {
    const newStartMinutes = getMinutesFromTime(startTime);
    const newEndMinutes = getMinutesFromTime(endTime);

    return blocks.some(block => {
      if (block.employeeId !== employeeId) return false;
      if (excludeBlockId && block.id === excludeBlockId) return false;

      const existingStartMinutes = getMinutesFromTime(block.startTime);
      const existingEndMinutes = getMinutesFromTime(block.endTime);

      // Check for overlap: new block overlaps with existing block
      return (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes);
    });
  };

  return (
    <>
      <div className="h-full overflow-auto">
        <div className="inline-block min-w-full">
          <div className="flex">
            {/* Time column - responsive width */}
            <div className="w-16 sm:w-20 flex-shrink-0 sticky left-0 bg-background z-10">
              <div className="h-12 border-b flex items-center px-1 sm:px-2">
                <span className="text-xs font-medium text-muted-foreground">{t.time}</span>
              </div>
            </div>

            {/* Employee columns - responsive minimum width */}
            {employees.map(employee => (
              <div key={employee.id} className="flex-1 min-w-[140px] sm:min-w-[200px]">
                <div className="h-12 border-b border-l px-2 sm:px-4 flex items-center gap-1 sm:gap-2 bg-card">
                  <EmployeeAvatar name={employee.name} color={employee.color} />
                  <span className="text-xs sm:text-sm font-medium truncate">{employee.name}</span>
                </div>
              </div>
            ))}
          </div>

          {timeSlots.map((timeSlot, idx) => (
            <div key={timeSlot} className="flex">
              {/* Time slot - responsive width */}
              <div className="w-16 sm:w-20 flex-shrink-0 sticky left-0 bg-background z-10 border-b px-1 sm:px-2 py-2">
                <span className="text-xs text-muted-foreground">{timeSlot}</span>
              </div>

              {employees.map(employee => {
                const cellBlocks = getBlocksForCell(employee.id, timeSlot);
                
                return (
                  <div
                    key={`${employee.id}-${timeSlot}`}
                    className={`flex-1 min-w-[140px] sm:min-w-[200px] border-b border-l p-1 min-h-[40px] hover-elevate cursor-pointer relative ${
                      dragOverCell?.employeeId === employee.id && dragOverCell?.timeSlot === timeSlot
                        ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
                        : ''
                    }`}
                    onDragOver={(e) => handleDragOver(e, employee.id, timeSlot)}
                    onDrop={() => handleDrop(employee.id, timeSlot)}
                    onClick={() => handleCellClick(employee.id, timeSlot)}
                    data-testid={`cell-${employee.id}-${timeSlot}`}
                  >
                    {cellBlocks.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    {cellBlocks.map(block => {
                      // Only render the time block in the starting cell
                      if (!isBlockStart(block, timeSlot)) return null;
                      
                      // Calculate how many cells this block should span
                      const duration = calculateDuration(block.startTime, block.endTime);
                      const rowSpan = duration / 15; // Each row is 15 minutes
                      const height = rowSpan * 40; // Each row is 40px high
                      
                      return (
                        <TimeBlock
                          key={block.id}
                          block={block}
                          color={employee.color}
                          onDragStart={() => handleDragStart(block)}
                          onDelete={() => handleDeleteBlock(block.id)}
                          onEdit={handleEditBlock}
                          isDragging={draggedBlock?.id === block.id}
                          style={{ 
                            height: `${height}px`,
                            zIndex: 50,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                          }}
                        />
                      );
                    })}
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
                step="900"
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
                step="900"
                value={newBlockData.endTime}
                onChange={(e) => setNewBlockData({ ...newBlockData, endTime: e.target.value })}
                data-testid="input-end-time"
              />
            </div>
            <div>
              <Label htmlFor="clientName">{t.timeBlock.clientName}</Label>
              <Input
                id="clientName"
                placeholder={t.timeBlock.clientNamePlaceholder}
                value={newBlockData.clientName}
                onChange={(e) => setNewBlockData({ ...newBlockData, clientName: e.target.value })}
                data-testid="input-client-name"
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent data-testid="dialog-edit-block">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-start-time">{t.timeBlock.startTime}</Label>
              <Input
                id="edit-start-time"
                type="time"
                step="900"
                value={newBlockData.startTime}
                onChange={(e) => setNewBlockData({ ...newBlockData, startTime: e.target.value })}
                data-testid="input-edit-start-time"
              />
            </div>
            <div>
              <Label htmlFor="edit-end-time">{t.timeBlock.endTime}</Label>
              <Input
                id="edit-end-time"
                type="time"
                step="900"
                value={newBlockData.endTime}
                onChange={(e) => setNewBlockData({ ...newBlockData, endTime: e.target.value })}
                data-testid="input-edit-end-time"
              />
            </div>
            <div>
              <Label htmlFor="edit-clientName">{t.timeBlock.clientName}</Label>
              <Input
                id="edit-clientName"
                placeholder={t.timeBlock.clientNamePlaceholder}
                value={newBlockData.clientName}
                onChange={(e) => setNewBlockData({ ...newBlockData, clientName: e.target.value })}
                data-testid="input-edit-client-name"
              />
            </div>
            <div>
              <Label htmlFor="edit-task">{t.timeBlock.task}</Label>
              <Input
                id="edit-task"
                placeholder={t.timeBlock.taskPlaceholder}
                value={newBlockData.task}
                onChange={(e) => setNewBlockData({ ...newBlockData, task: e.target.value })}
                data-testid="input-edit-task"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} data-testid="button-edit-cancel">
              {t.timeBlock.cancel}
            </Button>
            <Button onClick={handleUpdateBlock} data-testid="button-update">
              Update Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
