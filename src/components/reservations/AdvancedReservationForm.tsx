import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar, Clock, User, Book, GraduationCap, Send, MapPin, Repeat, CalendarDays } from 'lucide-react';
import type { ReservationRequest } from '../../types/reservations';
import { 
  TIME_SCHEDULES, 
  USER_TYPES, 
  CLASSROOMS, 
  CURRENT_SEMESTER,
  getRecurringDates
} from '../../types/reservations';

interface AdvancedReservationFormProps {
  onSubmit: (reservation: ReservationRequest) => Promise<void>;
  isLoading?: boolean;
}

export const AdvancedReservationForm: React.FC<AdvancedReservationFormProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Partial<ReservationRequest>>({
    userEmail: '',
    userName: '',
    userType: 'professor',
    subject: '',
    course: '',
    classroom: 'LabComp',
    reservationType: 'specific_dates',
    dates: [],
    startTime: '13:30',
    endTime: '15:30',
    observations: '',
    semester: CURRENT_SEMESTER
  });

  const [specificDates, setSpecificDates] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [recurringPreview, setRecurringPreview] = useState<string[]>([]);

  const validateEmail = (email: string): boolean => {
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

    if (!formData.startTime || !formData.endTime) {
      newErrors.time = 'Horários são obrigatórios';
    }

    if (formData.userType === 'professor') {
      if (!formData.subject) {
        newErrors.subject = 'Nome da matéria é obrigatório para professores';
      }
    }

    if (formData.reservationType === 'specific_dates') {
      if (!formData.dates || formData.dates.length === 0) {
        newErrors.dates = 'Pelo menos uma data deve ser selecionada';
      }
    } else if (formData.reservationType === 'recurring') {
      if (!formData.startDate || !formData.endDate || formData.dayOfWeek === undefined) {
        newErrors.recurring = 'Dados da recorrência são obrigatórios';
      }
    } else if (formData.reservationType === 'single') {
      if (!formData.date) {
        newErrors.date = 'Data é obrigatória';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSpecificDatesChange = (value: string) => {
    setSpecificDates(value);
    
    // Parse das datas (formato: DD/MM/YYYY ou DD/MM)
    const dateLines = value.split('\n').filter(line => line.trim());
    const parsedDates: string[] = [];
    
    dateLines.forEach(line => {
      const match = line.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/);
      if (match) {
        const day = match[1].padStart(2, '0');
        const month = match[2].padStart(2, '0');
        const year = match[3] || '2025';
        parsedDates.push(`${year}-${month}-${day}`);
      }
    });
    
    setFormData(prev => ({ ...prev, dates: parsedDates }));
  };

  const handleRecurringChange = () => {
    if (formData.dayOfWeek !== undefined && formData.startDate && formData.endDate) {
      const dates = getRecurringDates(formData.dayOfWeek, formData.startDate, formData.endDate);
      setRecurringPreview(dates);
    }
  };

  const getAllTimeSlots = (): string[] => {
    return [
      ...TIME_SCHEDULES.MORNING.slots,
      ...TIME_SCHEDULES.AFTERNOON.slots,
      ...TIME_SCHEDULES.EVENING.slots
    ];
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
        userType: 'professor',
        subject: '',
        course: '',
        classroom: 'LabComp',
        reservationType: 'specific_dates',
        dates: [],
        startTime: '13:30',
        endTime: '15:30',
        observations: '',
        semester: CURRENT_SEMESTER
      });
      setSpecificDates('');
      setRecurringPreview([]);
    } catch (error) {
      console.error('Erro ao enviar reserva:', error);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Solicitar Reserva - Sistema Avançado</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações do Usuário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <option value={USER_TYPES.PROFESSOR}>Professor</option>
              <option value={USER_TYPES.STUDENT}>Estudante</option>
            </select>
          </div>

          <div>
            <Label htmlFor="classroom" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Sala
            </Label>
            <select
              id="classroom"
              value={formData.classroom}
              onChange={(e) => setFormData(prev => ({ ...prev, classroom: e.target.value }))}
              className="w-full p-2 border rounded-md"
            >
              <option value={CLASSROOMS.LABCOMP}>LabComp</option>
              <option value={CLASSROOMS.MP53}>MP 53</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Dados da Disciplina */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="subject" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Disciplina *
            </Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Ex: EXA 806 Estruturas de Dados"
              className={errors.subject ? 'border-red-500' : ''}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
            )}
          </div>

          <div>
            <Label htmlFor="course" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Curso
            </Label>
            <Input
              id="course"
              value={formData.course}
              onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
              placeholder="Ex: Engenharia de Computação"
            />
          </div>
        </div>

        {/* Tipo de Reserva */}
        <div>
          <Label className="text-base font-medium mb-3 block">Tipo de Reserva</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, reservationType: 'specific_dates' }))}
              className={`p-3 border rounded-lg text-left transition-colors ${
                formData.reservationType === 'specific_dates'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <CalendarDays className="h-5 w-5 mb-2" />
              <div className="font-medium">Datas Específicas</div>
              <div className="text-sm text-gray-600">Lista de datas pontuais</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, reservationType: 'recurring' }))}
              className={`p-3 border rounded-lg text-left transition-colors ${
                formData.reservationType === 'recurring'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Repeat className="h-5 w-5 mb-2" />
              <div className="font-medium">Recorrente</div>
              <div className="text-sm text-gray-600">Mesmo dia toda semana</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, reservationType: 'single' }))}
              className={`p-3 border rounded-lg text-left transition-colors ${
                formData.reservationType === 'single'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Calendar className="h-5 w-5 mb-2" />
              <div className="font-medium">Data Única</div>
              <div className="text-sm text-gray-600">Apenas uma data</div>
            </button>
          </div>
        </div>

        {/* Configuração baseada no tipo */}
        {formData.reservationType === 'specific_dates' && (
          <div>
            <Label htmlFor="specificDates">Datas Específicas *</Label>
            <textarea
              id="specificDates"
              value={specificDates}
              onChange={(e) => handleSpecificDatesChange(e.target.value)}
              placeholder={`Liste as datas, uma por linha. Exemplos:
26/08
09/09
23/09
11/11
02/12`}
              className="w-full p-3 border rounded-md resize-none font-mono text-sm"
              rows={6}
            />
            {formData.dates && formData.dates.length > 0 && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                <strong>Datas reconhecidas ({formData.dates.length}):</strong>
                <div className="mt-1">
                  {formData.dates.map(date => new Date(date).toLocaleDateString('pt-BR')).join(', ')}
                </div>
              </div>
            )}
            {errors.dates && (
              <p className="text-red-500 text-sm mt-1">{errors.dates}</p>
            )}
          </div>
        )}

        {formData.reservationType === 'recurring' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dayOfWeek">Dia da Semana *</Label>
              <select
                id="dayOfWeek"
                value={formData.dayOfWeek ?? ''}
                onChange={(e) => {
                  const dayOfWeek = parseInt(e.target.value);
                  setFormData(prev => ({ ...prev, dayOfWeek }));
                  setTimeout(handleRecurringChange, 100);
                }}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Selecione...</option>
                <option value="1">Segunda-feira</option>
                <option value="2">Terça-feira</option>
                <option value="3">Quarta-feira</option>
                <option value="4">Quinta-feira</option>
                <option value="5">Sexta-feira</option>
              </select>
            </div>

            <div>
              <Label htmlFor="startDate">Data de Início *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, startDate: e.target.value }));
                  setTimeout(handleRecurringChange, 100);
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="endDate">Data de Fim *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, endDate: e.target.value }));
                  setTimeout(handleRecurringChange, 100);
                }}
                min={formData.startDate}
              />
            </div>

            {recurringPreview.length > 0 && (
              <div className="md:col-span-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <strong>Preview das Datas ({recurringPreview.length} aulas):</strong>
                <div className="mt-2 text-sm">
                  {recurringPreview.slice(0, 10).map(date => new Date(date).toLocaleDateString('pt-BR')).join(', ')}
                  {recurringPreview.length > 10 && ` ... e mais ${recurringPreview.length - 10} datas`}
                </div>
              </div>
            )}

            {errors.recurring && (
              <p className="text-red-500 text-sm mt-1 md:col-span-3">{errors.recurring}</p>
            )}
          </div>
        )}

        {formData.reservationType === 'single' && (
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
        )}

        {/* Horários */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horário de Início *
            </Label>
            <select
              id="startTime"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full p-2 border rounded-md"
            >
              {getAllTimeSlots().map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="endTime">Horário de Fim *</Label>
            <select
              id="endTime"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              className="w-full p-2 border rounded-md"
            >
              {getAllTimeSlots().map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>

        {errors.time && (
          <p className="text-red-500 text-sm">{errors.time}</p>
        )}

        {/* Observações */}
        <div>
          <Label htmlFor="observations">Observações</Label>
          <textarea
            id="observations"
            value={formData.observations}
            onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
            placeholder="Informações adicionais (opcional)"
            className="w-full p-3 border rounded-md resize-none"
            rows={3}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full flex items-center gap-2"
          disabled={isLoading}
        >
          <Send className="h-4 w-4" />
          {isLoading ? 'Enviando...' : 'Enviar Solicitação para Departamento'}
        </Button>
      </form>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
        <p className="font-medium mb-2">ℹ️ Processo de Aprovação:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Sua solicitação será enviada para análise</li>
          <li>O departamento revisará e confirmará a reserva</li>
          <li>Você receberá uma confirmação quando aprovada</li>
          <li>As aulas aparecerão no calendário oficial</li>
        </ol>
      </div>
    </Card>
  );
};
