import { Clock, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface TimeBlockData {
  id: string;
  employeeId: string;
  startTime: string;
  endTime: string;
  task?: string;
}

interface TimeBlockProps {
  block: TimeBlockData;
  color: string;
  onDragStart?: (e: React.DragEvent) => void;
  onDelete?: () => void;
  isDragging?: boolean;
}

export default function TimeBlock({ 
  block, 
  color, 
  onDragStart, 
  onDelete,
  isDragging = false 
}: TimeBlockProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`rounded-lg p-2 shadow-sm border cursor-move transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      style={{ 
        backgroundColor: color,
        borderColor: `hsl(from ${color} h s calc(l - 8))`,
      }}
      data-testid={`time-block-${block.id}`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-white/70 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-white text-sm font-medium">
            <Clock className="h-3.5 w-3.5" />
            <span>{block.startTime} - {block.endTime}</span>
          </div>
          {block.task && (
            <p className="text-white/90 text-xs mt-1 truncate">{block.task}</p>
          )}
        </div>
        {isHovered && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/20 no-default-hover-elevate"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            data-testid={`button-delete-${block.id}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
