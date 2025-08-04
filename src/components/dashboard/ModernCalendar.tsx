import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { DailySchedule } from '../../types/lab';

interface CalendarProps {
  dailySchedules?: { [dateKey: string]: DailySchedule };
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

export function ModernCalendar({ 
  dailySchedules, 
  selectedDate, 
  onDateSelect, 
  className 
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { monthData, monthName } = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const monthName = currentMonth.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });

    // Create calendar grid
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return { monthData: days, monthName };
  }, [currentMonth]);

  const isDateAvailable = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    return dailySchedules?.[dateKey]?.active || false;
  };

  const hasSchedule = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    return Boolean(dailySchedules?.[dateKey]);
  };

  const isDateSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const availableCount = dailySchedules ? Object.keys(dailySchedules).filter(dateKey => {
    const date = new Date(dateKey);
    return date.getMonth() === currentMonth.getMonth() && 
           date.getFullYear() === currentMonth.getFullYear() &&
           dailySchedules[dateKey].active;
  }).length : 0;

  const scheduledCount = dailySchedules ? Object.keys(dailySchedules).filter(dateKey => {
    const date = new Date(dateKey);
    return date.getMonth() === currentMonth.getMonth() && 
           date.getFullYear() === currentMonth.getFullYear();
  }).length : 0;

  return (
    <div className={cn(
      "bg-white rounded-2xl shadow-2xl border border-uefs-gray-200 p-6 transform transition-all duration-300 hover:shadow-3xl",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-uefs-primary to-uefs-secondary rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-uefs-dark capitalize">
            {monthName}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-uefs-gray-100 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 text-uefs-gray-600 group-hover:text-uefs-primary" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-uefs-gray-100 transition-colors group"
          >
            <ChevronRight className="w-5 h-5 text-uefs-gray-600 group-hover:text-uefs-primary" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-uefs-gray-50 to-uefs-primary/5 rounded-xl border border-uefs-gray-100">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-uefs-accent" />
          <span className="text-sm font-medium text-uefs-gray-700">
            {availableCount} funcionando / {scheduledCount} programados
          </span>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-uefs-accent rounded-full shadow-sm"></div>
            <span className="text-xs text-uefs-gray-600 font-medium">Funcionando</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-uefs-danger rounded-full shadow-sm"></div>
            <span className="text-xs text-uefs-gray-600 font-medium">Fechado</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-uefs-gray-300 rounded-full shadow-sm"></div>
            <span className="text-xs text-uefs-gray-600 font-medium">Sem dados</span>
          </div>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div 
            key={day} 
            className="p-2 text-center text-xs font-medium text-uefs-gray-500 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {monthData.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-2"></div>;
          }

          const available = isDateAvailable(date);
          const scheduled = hasSchedule(date);
          const selected = isDateSelected(date);
          const today = isToday(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => scheduled && onDateSelect?.(date)}
              disabled={!scheduled}
              className={cn(
                "relative p-2 text-sm rounded-lg transition-all duration-200 border",
                {
                  // Available dates (scheduled and active)
                  "bg-uefs-accent/10 border-uefs-accent/20 text-uefs-dark hover:bg-uefs-accent/20 hover:scale-105": scheduled && available && !selected,
                  // Closed dates (scheduled but not active)
                  "bg-uefs-danger/10 border-uefs-danger/20 text-uefs-dark hover:bg-uefs-danger/20": scheduled && !available && !selected,
                  // Selected date
                  "bg-uefs-primary text-white border-uefs-primary shadow-uefs": selected,
                  // Today marker
                  "ring-2 ring-uefs-secondary ring-offset-1": today && !selected,
                  // Unscheduled dates
                  "text-uefs-gray-300 border-transparent cursor-not-allowed": !scheduled,
                  // Hover effects
                  "hover:shadow-md": scheduled,
                }
              )}
            >
              <span className="relative z-10">{date.getDate()}</span>
              
              {/* Today indicator */}
              {today && !selected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-uefs-secondary rounded-full"></div>
              )}
              
              {/* Status indicator */}
              {scheduled && !selected && (
                <div className={cn(
                  "absolute top-1 right-1 w-2 h-2 rounded-full",
                  available ? "bg-uefs-accent" : "bg-uefs-danger"
                )}></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-uefs-gray-200">
        <p className="text-xs text-uefs-gray-500 text-center">
          Clique em uma data programada para visualizar os horários específicos
        </p>
      </div>
    </div>
  );
}