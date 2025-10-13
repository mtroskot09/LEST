import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface DateNavigatorProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export default function DateNavigator({ date, onDateChange }: DateNavigatorProps) {
  const handlePrevDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleToday}
        data-testid="button-today"
      >
        <Calendar className="h-4 w-4 mr-1" />
        Today
      </Button>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevDay}
          data-testid="button-prev-day"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-[160px] text-center">
          <span className="text-sm font-medium" data-testid="text-current-date">
            {format(date, 'EEEE, MMM d, yyyy')}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextDay}
          data-testid="button-next-day"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
