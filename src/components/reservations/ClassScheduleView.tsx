import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  Plus, 
  Check, 
  X, 
  AlertCircle 
} from 'lucide-react';
import { useReservations } from '../../hooks/useReservations';
import { ReservationForm } from './ReservationForm';
import type { Reservation } from '../../types/reservations';

interface ClassScheduleViewProps {
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
  showReservationForm?: boolean;
  userRole?: 'student' | 'professor' | 'admin';
}

export const ClassScheduleView: React.FC<ClassScheduleViewProps> = ({
  selectedDate,
  onDateSelect,
  showReservationForm = false,
  userRole = 'student'
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(showReservationForm);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  
  const {
    loading,
    error,
    createReservation,
    getAvailableSlots,
    getReservationsByDate
  } = useReservations();

  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  }, [selectedDate]);

  const handleDateChange = (date: string) => {
    setCurrentDate(date);
    onDateSelect?.(date);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setShowForm(true);
  };

  const handleReservationSubmit = async (request: any) => {
    try {
      await createReservation(request);
      setShowForm(false);
      setSelectedTimeSlot('');
      // Mostrar mensagem de sucesso
    } catch (err) {
      // Mostrar mensagem de erro
      console.error('Erro ao criar reserva:', err);
    }
  };

  const getTimeSlots = () => {
    const dayOfWeek = new Date(currentDate).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    if (isWeekend) {
      return { slots: [], message: 'Laboratório fechado nos fins de semana' };
    }

    const isFriday = dayOfWeek === 5;
    const slots: { time: string; available: boolean; reservation?: Reservation }[] = [];
    
    if (isFriday) {
      // Sexta-feira: 08:00 - 14:00
      for (let hour = 8; hour < 14; hour++) {
        slots.push({
          time: `${hour.toString().padStart(2, '0')}:00`,
          available: true,
        });
      }
    } else {
      // Segunda a quinta: 12:00 - 18:00
      for (let hour = 12; hour < 18; hour++) {
        slots.push({
          time: `${hour.toString().padStart(2, '0')}:00`,
          available: true,
        });
      }
    }

    // Marcar horários ocupados
    const dateReservations = getReservationsByDate(currentDate);
    const availableTimeSlots = getAvailableSlots(currentDate);
    
    slots.forEach(slot => {
      const reservation = dateReservations.find(r => 
        r.startTime === slot.time && r.status === 'approved'
      );
      
      if (reservation) {
        slot.available = false;
        slot.reservation = reservation;
      } else {
        slot.available = availableTimeSlots.includes(slot.time);
      }
    });

    return { slots, message: null };
  };

  const getStatusIcon = (reservation?: Reservation) => {
    if (!reservation) return null;
    
    switch (reservation.status) {
      case 'approved':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getSlotColor = (slot: { time: string; available: boolean; reservation?: Reservation }) => {
    if (!slot.available && slot.reservation) {
      switch (slot.reservation.status) {
        case 'approved':
          return 'bg-red-100 border-red-300 text-red-800';
        case 'pending':
          return 'bg-yellow-100 border-yellow-300 text-yellow-800';
        case 'rejected':
          return 'bg-gray-100 border-gray-300 text-gray-600';
        default:
          return 'bg-gray-100 border-gray-300 text-gray-600';
      }
    }
    return slot.available 
      ? 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200 cursor-pointer'
      : 'bg-gray-100 border-gray-300 text-gray-600';
  };

  const { slots, message } = getTimeSlots();

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seletor de Data */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Selecionar Data
            </label>
            <input
              type="date"
              id="date"
              value={currentDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </Card>

      {/* Grade de Horários */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">
            Horários - {new Date(currentDate).toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
        </div>

        {message ? (
          <div className="text-center py-8 text-gray-600">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{message}</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {slots.map((slot) => (
              <div
                key={slot.time}
                className={`p-4 border rounded-lg transition-colors ${getSlotColor(slot)}`}
                onClick={() => slot.available && handleTimeSlotSelect(slot.time)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">
                      {slot.time} - {
                        (() => {
                          const [hours, minutes] = slot.time.split(':').map(Number);
                          const endDate = new Date();
                          endDate.setHours(hours + 1, minutes);
                          return endDate.toTimeString().slice(0, 5);
                        })()
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(slot.reservation)}
                    {slot.available ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-4 w-4" />
                        <span>Disponível</span>
                        {userRole !== 'admin' && (
                          <Plus className="h-4 w-4 ml-2" />
                        )}
                      </div>
                    ) : slot.reservation ? (
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>
                            {slot.reservation.userType === 'professor' ? 
                              `${slot.reservation.subject} - ${slot.reservation.course}` :
                              'Aula reservada'
                            }
                          </span>
                        </div>
                        <div className="text-xs opacity-75">
                          {slot.reservation.userName}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm">Indisponível</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legenda */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Legenda:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
              <span>Horário livre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
              <span>Aula confirmada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded"></div>
              <span>Aguardando aprovação</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
              <span>Indisponível</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Formulário de Reserva */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Nova Reserva</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowForm(false);
                  setSelectedTimeSlot('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <ReservationForm
                selectedDate={currentDate}
                selectedTimeSlot={selectedTimeSlot}
                onSubmit={handleReservationSubmit}
                availableSlots={getAvailableSlots(currentDate)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
