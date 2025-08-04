import type { LabConfig, DayOfWeek, DailySchedule } from '../../types/lab';
import { getCurrentDay, formatDayName, formatTime } from '../../lib/timeUtils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Clock, Calendar, X, ArrowLeft } from 'lucide-react';

interface ScheduleGridProps {
  config: LabConfig;
  selectedDate?: Date;
  dailySchedules?: { [dateKey: string]: DailySchedule };
}

export function ScheduleGrid({ config, selectedDate, dailySchedules }: ScheduleGridProps) {
  const currentDay = getCurrentDay();
  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // If a specific date is selected, show daily schedule for that date
  if (selectedDate && dailySchedules) {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const dailySchedule = dailySchedules[dateKey];
    
    return (
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-2xl border border-uefs-gray-200 p-8 transform transition-all duration-300 hover:shadow-3xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-uefs-dark mb-2">
              Horário para {selectedDate.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long',
                year: 'numeric'
              })}
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-uefs-primary to-uefs-secondary rounded-full mx-auto"></div>
          </div>
          
          <div className="mb-8 p-6 bg-gradient-to-r from-uefs-primary/10 to-uefs-secondary/10 rounded-xl border border-uefs-primary/20">
            <p className="text-center text-uefs-primary text-lg font-bold">
              📅 {selectedDate.toLocaleDateString('pt-BR', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </p>
          </div>
          
          {dailySchedule ? (
            <Card className="max-w-lg mx-auto bg-gradient-to-br from-white to-uefs-primary/5 border-2 border-uefs-primary/20 shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-uefs-primary to-uefs-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-uefs-primary">
                  {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center pb-8">
                {dailySchedule.active ? (
                  <div>
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-uefs-accent mb-3">
                        {formatTime(dailySchedule.start)}
                      </div>
                      <div className="text-uefs-gray-500 text-lg mb-3 font-medium">às</div>
                      <div className="text-4xl font-bold text-uefs-accent mb-6">
                        {formatTime(dailySchedule.end)}
                      </div>
                    </div>
                    <div className="px-6 py-3 bg-gradient-to-r from-uefs-accent to-uefs-accent/90 rounded-full text-white font-bold border border-uefs-accent/20 shadow-lg">
                      ✓ Laboratório Funcionando
                    </div>
                    {dailySchedule.notes && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-uefs-gray-50 to-uefs-primary/5 rounded-xl text-uefs-gray-700 border border-uefs-gray-200">
                        <div className="text-sm font-medium text-uefs-primary mb-2">📝 Observações:</div>
                        <div className="text-sm">{dailySchedule.notes}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="w-16 h-16 bg-uefs-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <X className="w-8 h-8 text-uefs-gray-400" />
                    </div>
                    <div className="text-3xl font-bold text-uefs-gray-400 mb-6">
                      Laboratório Fechado
                    </div>
                    <div className="px-6 py-3 bg-uefs-gray-100 rounded-full text-uefs-gray-600 border border-uefs-gray-200">
                      ✗ Não funciona neste dia
                    </div>
                    {dailySchedule.notes && (
                      <div className="mt-6 p-4 bg-uefs-gray-50 rounded-xl text-uefs-gray-700 border border-uefs-gray-200">
                        <div className="text-sm font-medium text-uefs-gray-600 mb-2">📝 Motivo:</div>
                        <div className="text-sm">{dailySchedule.notes}</div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="max-w-lg mx-auto bg-gradient-to-br from-uefs-gray-50 to-uefs-gray-100 border-2 border-uefs-gray-200">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-uefs-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-uefs-gray-400" />
                </div>
                <div className="text-xl text-uefs-gray-600 mb-4 font-medium">
                  Horário não definido
                </div>
                <div className="text-sm text-uefs-gray-500 mb-6">
                  Ainda não há horário cadastrado para esta data
                </div>
                <div className="px-4 py-2 bg-uefs-gray-200 rounded-full text-xs text-uefs-gray-600">
                  Entre em contato para mais informações
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-8 text-center">
            <button 
              onClick={() => window.location.reload()} 
              className="inline-flex items-center space-x-2 text-uefs-primary hover:text-uefs-dark text-lg font-bold transition-colors duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Voltar ao cronograma semanal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default weekly schedule view
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
    return 'Horários de Funcionamento Semanal';
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-2xl border border-uefs-gray-200 p-6 transform transition-all duration-300 hover:shadow-3xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-uefs-dark mb-2">
            {getDateTitle()}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-uefs-primary to-uefs-secondary rounded-full mx-auto"></div>
        </div>
        
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
        
        {/* Last Update */}
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
            <div className="mt-4 pt-4 border-t border-uefs-gray-300">
              <p className="text-xs text-uefs-gray-500">
                Última atualização: {new Date(config.lastUpdate).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}