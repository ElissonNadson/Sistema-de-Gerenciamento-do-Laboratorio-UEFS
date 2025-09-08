import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar, Clock, User, Book, GraduationCap, Send } from 'lucide-react';
import type { ReservationRequest } from '../../types/reservations';
import { TIME_SCHEDULES, USER_TYPES } from '../../types/reservations';

interface ReservationFormProps {
  selectedDate?: string;
  selectedTimeSlot?: string;
  onSubmit: (reservation: ReservationRequest) => Promise<void>;
  availableSlots: string[];
  isLoading?: boolean;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({
  selectedDate,
  selectedTimeSlot,
  onSubmit,
  availableSlots,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Partial<ReservationRequest>>({
    userEmail: '',
    userName: '',
    userType: 'student',
    subject: '',
    course: '',
    date: selectedDate || '',
    startTime: selectedTimeSlot || '',
    endTime: '',
    observations: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTimeSlot) {
      setFormData(prev => ({ 
        ...prev, 
        startTime: selectedTimeSlot,
        endTime: calculateEndTime(selectedTimeSlot)
      }));
    }
  }, [selectedTimeSlot]);

  const calculateEndTime = (startTime: string): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours + 1, minutes); // 1 hora de duração padrão
    return endDate.toTimeString().slice(0, 5);
  };

  const validateEmail = (email: string): boolean => {
    // Validação básica para email institucional
    const institutionalDomains = ['@uefs.br', '@aluno.uefs.br', '@docente.uefs.br'];
    return institutionalDomains.some(domain => email.endsWith(domain));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.userEmail) {
      newErrors.userEmail = 'Email é obrigatório';
    } else if (!validateEmail(formData.userEmail)) {
      newErrors.userEmail = 'Email deve ser institucional (@uefs.br)';
    }

    if (!formData.userName) {
      newErrors.userName = 'Nome é obrigatório';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Horário de início é obrigatório';
    }

    if (formData.userType === 'professor') {
      if (!formData.subject) {
        newErrors.subject = 'Nome da matéria é obrigatório para professores';
      }
      if (!formData.course) {
        newErrors.course = 'Nome do curso é obrigatório para professores';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData as ReservationRequest);
      // Reset form
      setFormData({
        userEmail: '',
        userName: '',
        userType: 'student',
        subject: '',
        course: '',
        date: '',
        startTime: '',
        endTime: '',
        observations: ''
      });
    } catch (error) {
      console.error('Erro ao enviar reserva:', error);
    }
  };

  const getDaySchedule = (date: string) => {
    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 5) { // Sexta-feira
      // Retorna todos os horários disponíveis de manhã e tarde
      return [...TIME_SCHEDULES.MORNING.slots, ...TIME_SCHEDULES.AFTERNOON.slots];
    }
    // Retorna todos os horários disponíveis (manhã, tarde e noite)
    return [...TIME_SCHEDULES.MORNING.slots, ...TIME_SCHEDULES.AFTERNOON.slots, ...TIME_SCHEDULES.EVENING.slots];
  };

  const generateTimeSlots = () => {
    if (!formData.date) return [];
    
    const daySlots = getDaySchedule(formData.date);
    // Filtra pelos slots realmente disponíveis passados via props
    return daySlots.filter(slot => availableSlots.includes(slot));
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Solicitar Reserva</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de usuário */}
        <div>
          <Label htmlFor="userType" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Tipo de Usuário
          </Label>
          <select
            id="userType"
            value={formData.userType}
            onChange={(e) => setFormData(prev => ({ ...prev, userType: e.target.value as 'student' | 'professor' }))}
            className="w-full p-2 border rounded-md"
          >
            <option value={USER_TYPES.STUDENT}>Estudante</option>
            <option value={USER_TYPES.PROFESSOR}>Professor</option>
          </select>
        </div>

        {/* Email institucional */}
        <div>
          <Label htmlFor="userEmail">Email Institucional *</Label>
          <Input
            id="userEmail"
            type="email"
            value={formData.userEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, userEmail: e.target.value }))}
            placeholder="nome@uefs.br"
            className={errors.userEmail ? 'border-red-500' : ''}
          />
          {errors.userEmail && (
            <p className="text-red-500 text-sm mt-1">{errors.userEmail}</p>
          )}
        </div>

        {/* Nome */}
        <div>
          <Label htmlFor="userName">Nome Completo *</Label>
          <Input
            id="userName"
            value={formData.userName}
            onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
            placeholder="Seu nome completo"
            className={errors.userName ? 'border-red-500' : ''}
          />
          {errors.userName && (
            <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
          )}
        </div>

        {/* Campos específicos para professores */}
        {formData.userType === 'professor' && (
          <>
            <div>
              <Label htmlFor="subject" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                Nome da Matéria *
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Ex: Programação I"
                className={errors.subject ? 'border-red-500' : ''}
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
              )}
            </div>

            <div>
              <Label htmlFor="course" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Nome do Curso *
              </Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                placeholder="Ex: Engenharia de Computação"
                className={errors.course ? 'border-red-500' : ''}
              />
              {errors.course && (
                <p className="text-red-500 text-sm mt-1">{errors.course}</p>
              )}
            </div>
          </>
        )}

        {/* Data */}
        <div>
          <Label htmlFor="date">Data *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className={errors.date ? 'border-red-500' : ''}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        {/* Horário */}
        <div>
          <Label htmlFor="startTime" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Horário de Início *
          </Label>
          <select
            id="startTime"
            value={formData.startTime}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              startTime: e.target.value,
              endTime: calculateEndTime(e.target.value)
            }))}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Selecione um horário</option>
            {generateTimeSlots().map(slot => (
              <option key={slot} value={slot}>
                {slot} - {calculateEndTime(slot)}
              </option>
            ))}
          </select>
          {errors.startTime && (
            <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
          )}
        </div>

        {/* Observações */}
        <div>
          <Label htmlFor="observations">Observações</Label>
          <textarea
            id="observations"
            value={formData.observations}
            onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
            placeholder="Informações adicionais (opcional)"
            className="w-full p-2 border rounded-md resize-none"
            rows={3}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full flex items-center gap-2"
          disabled={isLoading}
        >
          <Send className="h-4 w-4" />
          {isLoading ? 'Enviando...' : 'Enviar Solicitação'}
        </Button>
      </form>

      <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
        <p>ℹ️ Sua solicitação será analisada pela administração e você receberá uma resposta em breve.</p>
      </div>
    </Card>
  );
};