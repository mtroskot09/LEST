import { Clock, GripVertical, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export interface TimeBlockData {
  id: string;
  employeeId: string;
  startTime: string;
  endTime: string;
  task?: string;
  clientName?: string;
}

interface TimeBlockProps {
  block: TimeBlockData;
  color: string;
  onDragStart?: (e: React.DragEvent) => void;
  onDelete?: () => void;
  onEdit?: (block: TimeBlockData) => void;
  isDragging?: boolean;
  style?: React.CSSProperties;
}

export default function TimeBlock({ 
  block, 
  color, 
  onDragStart, 
  onDelete,
  onEdit,
  isDragging = false,
  style = {}
}: TimeBlockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`rounded-lg p-1.5 shadow-sm cursor-move transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      style={{ 
        backgroundColor: color,
        ...style,
      }}
      data-testid={`time-block-${block.id}`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-white/70 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="text-white text-xs font-medium truncate">
            <Clock className="h-3 w-3 inline mr-1" />
            {block.startTime} - {block.endTime}
            {block.clientName && (
              <span className="font-semibold ml-1">• {t.name}: {block.clientName}</span>
            )}
            {block.task && (
              <span className="text-white/90 ml-1">• {t.service}: {block.task}</span>
            )}
          </div>
        </div>
        {isHovered && (onDelete || onEdit) && (
          <div className="flex gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/20 no-default-hover-elevate"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(block);
                }}
                data-testid={`button-edit-${block.id}`}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            )}
            {onDelete && (
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
        )}
      </div>
    </div>
  );
}
