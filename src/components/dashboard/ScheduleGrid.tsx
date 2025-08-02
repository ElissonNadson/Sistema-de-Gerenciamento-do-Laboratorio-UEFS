import type { LabConfig, DayOfWeek } from '../../types/lab';
import { getCurrentDay, formatDayName, formatTime } from '../../lib/timeUtils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ScheduleGridProps {
  config: LabConfig;
}

export function ScheduleGrid({ config }: ScheduleGridProps) {
  const currentDay = getCurrentDay();
  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const isCurrentDay = (day: DayOfWeek) => day === currentDay;

  const getDayStatusClass = (day: DayOfWeek) => {
    const schedule = config.schedule[day];
    const isCurrent = isCurrentDay(day);
    
    if (isCurrent) {
      return 'ring-2 ring-blue-500 bg-blue-50';
    }
    
    if (!schedule.active) {
      return 'bg-gray-100';
    }
    
    return 'bg-white hover:bg-gray-50';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Horários de Funcionamento
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {days.map((day) => {
          const schedule = config.schedule[day];
          return (
            <Card 
              key={day} 
              className={`transition-all duration-200 ${getDayStatusClass(day)}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isCurrentDay(day) ? 'text-blue-600' : 'text-gray-800'}`}>
                  {formatDayName(day)}
                  {isCurrentDay(day) && (
                    <span className="ml-2 text-sm font-normal text-blue-500">
                      (Hoje)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                {schedule.active ? (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {formatTime(schedule.start)}
                    </div>
                    <div className="text-gray-500 text-sm mb-1">às</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatTime(schedule.end)}
                    </div>
                    <div className="mt-2 text-xs text-green-600 font-medium">
                      ✓ Funcionando
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-400 mb-2">
                      Fechado
                    </div>
                    <div className="text-xs text-gray-400">
                      ✗ Não funciona
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-600">
        <p className="mb-2">
          <strong>Observações:</strong>
        </p>
        <ul className="space-y-1 max-w-md mx-auto">
          <li>• Véspera de feriados: 08:00 - 14:00</li>
          <li>• Feriados nacionais e estaduais: Fechado</li>
          <li>• Horários podem ser alterados conforme necessidade</li>
        </ul>
      </div>
    </div>
  );
}