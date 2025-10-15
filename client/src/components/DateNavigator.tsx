import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface DateNavigatorProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export default function DateNavigator({ date, onDateChange }: DateNavigatorProps) {
  const { t } = useLanguage();

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
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Today button - hide text on mobile */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleToday}
        data-testid="button-today"
        className="flex-shrink-0"
      >
        <Calendar className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">{t.date.today}</span>
      </Button>
      
      {/* Date navigation */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevDay}
          data-testid="button-prev-day"
          className="flex-shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Date display - shorter format on mobile */}
        <div className="min-w-[120px] sm:min-w-[160px] text-center">
          <span className="text-xs sm:text-sm font-medium" data-testid="text-current-date">
            <span className="sm:hidden">{format(date, 'MMM d')}</span>
            <span className="hidden sm:inline">{format(date, 'EEEE, MMM d, yyyy')}</span>
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextDay}
          data-testid="button-next-day"
          className="flex-shrink-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
