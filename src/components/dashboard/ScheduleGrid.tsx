import type { LabConfig, DayOfWeek } from '../../types/lab';
import { getCurrentDay, formatDayName, formatTime } from '../../lib/timeUtils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ScheduleGridProps {
  config: LabConfig;
  selectedDate?: Date;
}

export function ScheduleGrid({ config, selectedDate }: ScheduleGridProps) {
  const currentDay = getCurrentDay();
  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const isCurrentDay = (day: DayOfWeek) => day === currentDay;

  const getDayStatusClass = (day: DayOfWeek) => {
    const schedule = config.schedule[day];
    const isCurrent = isCurrentDay(day);
    
    if (isCurrent) {
      return 'ring-2 ring-uefs-primary bg-uefs-primary/5 border-uefs-primary/20';
    }
    
    if (!schedule.active) {
      return 'bg-uefs-gray-100 border-uefs-gray-200';
    }
    
    return 'bg-white hover:bg-uefs-gray-50 border-uefs-gray-200 hover:border-uefs-primary/30 hover:shadow-uefs';
  };

  const getDateTitle = () => {
    if (selectedDate) {
      return `Horários para ${selectedDate.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      })}`;
    }
    return 'Horários de Funcionamento';
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-uefs border border-uefs-gray-200 p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-uefs-dark">
          {getDateTitle()}
        </h2>
        
        {selectedDate && (
          <div className="mb-6 p-4 bg-uefs-primary/5 rounded-lg border border-uefs-primary/20">
            <p className="text-center text-uefs-primary text-sm font-medium">
              📅 Data selecionada: {selectedDate.toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {days.map((day) => {
            const schedule = config.schedule[day];
            return (
              <Card 
                key={day} 
                className={`transition-all duration-300 border ${getDayStatusClass(day)}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className={`text-lg ${isCurrentDay(day) ? 'text-uefs-primary' : 'text-uefs-dark'}`}>
                    {formatDayName(day)}
                    {isCurrentDay(day) && (
                      <span className="ml-2 text-sm font-normal text-uefs-secondary">
                        (Hoje)
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {schedule.active ? (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-uefs-accent mb-1">
                        {formatTime(schedule.start)}
                      </div>
                      <div className="text-uefs-gray-500 text-sm mb-1">às</div>
                      <div className="text-2xl font-bold text-uefs-accent">
                        {formatTime(schedule.end)}
                      </div>
                      <div className="mt-3 px-3 py-1 bg-uefs-accent/10 rounded-full text-xs text-uefs-accent font-medium border border-uefs-accent/20">
                        ✓ Funcionando
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-xl font-bold text-uefs-gray-400 mb-2">
                        Fechado
                      </div>
                      <div className="mt-3 px-3 py-1 bg-uefs-gray-100 rounded-full text-xs text-uefs-gray-400 border border-uefs-gray-200">
                        ✗ Não funciona
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-8 p-4 bg-uefs-gray-50 rounded-lg border border-uefs-gray-200">
          <div className="text-center text-sm text-uefs-gray-600">
            <p className="mb-3 font-semibold text-uefs-dark">
              📋 Observações Importantes
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="flex items-start space-x-2">
                <span className="text-uefs-warning mt-0.5">⏰</span>
                <span>Véspera de feriados: 08:00 - 14:00</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-uefs-danger mt-0.5">🚫</span>
                <span>Feriados nacionais e estaduais: Fechado</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-uefs-secondary mt-0.5">ℹ️</span>
                <span>Horários podem ser alterados conforme necessidade</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}