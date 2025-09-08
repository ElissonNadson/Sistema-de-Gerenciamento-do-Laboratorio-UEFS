export interface Reservation {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userType: 'student' | 'professor';
  
  // Dados específicos para professores
  subject?: string; // Nome da matéria (ex: EXA 806 Estruturas de Dados)
  course?: string;  // Nome do curso
  classroom?: string; // Sala específica (ex: MP 53, LabComp)
  
  // Dados da reserva
  reservationType: 'single' | 'recurring' | 'specific_dates'; // Tipo de reserva
  
  // Para reserva única ou datas específicas
  dates?: string[]; // Array de datas no formato YYYY-MM-DD
  
  // Para reserva recorrente
  dayOfWeek?: number; // 0=domingo, 1=segunda, etc.
  startDate?: string; // Data de início da recorrência
  endDate?: string; // Data de fim da recorrência (final do semestre)
  
  // Horários (podem ser múltiplos slots consecutivos)
  startTime: string; // Horário de início (HH:mm)
  endTime: string; // Horário de fim (HH:mm)
  timeSlots: string[]; // Array de slots de 30min ocupados
  
  // Status e controle
  status: 'pending' | 'approved' | 'rejected' | 'awaiting_department_confirmation';
  createdAt: Date;
  updatedAt: Date;
  
  // Aprovação administrativa/departamental
  approvedBy?: string; // ID do admin que aprovou
  approvedAt?: Date;
  departmentConfirmedBy?: string; // Email/nome de quem confirmou pelo departamento
  departmentConfirmedAt?: Date;
  rejectionReason?: string;
  
  // Observações
  observations?: string;
  
  // Dados específicos para controle semestral
  semester?: string; // ex: "2025.2"
  isRecurring?: boolean; // Flag para identificar reservas recorrentes
  recurringGroupId?: string; // ID para agrupar reservas da mesma recorrência
}

export interface ReservationRequest {
  userEmail: string;
  userName: string;
  userType: 'student' | 'professor';
  subject?: string;
  course?: string;
  classroom?: string;
  
  reservationType: 'single' | 'recurring' | 'specific_dates';
  
  // Para reserva única
  date?: string;
  
  // Para datas específicas
  dates?: string[];
  
  // Para reserva recorrente
  dayOfWeek?: number;
  startDate?: string;
  endDate?: string;
  
  // Horários
  startTime: string;
  endTime: string;
  
  observations?: string;
  semester?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
  reservedBy?: string; // ID da reserva que ocupa este horário
  reservationType?: 'class' | 'maintenance' | 'other';
  professorName?: string; // Nome do professor para exibição
}

export interface DaySchedule {
  date: string;
  dayOfWeek: string;
  isOpen: boolean;
  shifts: {
    morning: TimeSlot[];
    afternoon: TimeSlot[];
    evening: TimeSlot[];
  };
  reservations: Reservation[];
}

export interface ScheduleFilters {
  startDate: string;
  endDate: string;
  userType?: 'student' | 'professor';
  status?: 'pending' | 'approved' | 'rejected' | 'awaiting_department_confirmation';
  course?: string;
  classroom?: string;
  semester?: string;
}

// Constantes para validação - horários de 30 em 30 minutos
export const TIME_SCHEDULES = {
  MORNING: {
    start: '07:30',
    end: '12:30',
    slots: [
      '07:30', '08:00', '08:30', '09:00', '09:30', 
      '10:00', '10:30', '11:00', '11:30', '12:00'
    ]
  },
  AFTERNOON: {
    start: '13:30',
    end: '18:30',
    slots: [
      '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00'
    ]
  },
  EVENING: {
    start: '18:30',
    end: '23:30',
    slots: [
      '18:30', '19:00', '19:30', '20:00', '20:30',
      '21:00', '21:30', '22:00', '22:30', '23:00'
    ]
  }
};

export const TIME_SLOT_DURATION = 30; // 30 minutos por slot

export const RESERVATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved', 
  REJECTED: 'rejected',
  AWAITING_DEPARTMENT: 'awaiting_department_confirmation'
} as const;

export const RESERVATION_TYPES = {
  SINGLE: 'single',
  RECURRING: 'recurring',
  SPECIFIC_DATES: 'specific_dates'
} as const;

export const USER_TYPES = {
  STUDENT: 'student',
  PROFESSOR: 'professor'
} as const;

export const CLASSROOMS = {
  LABCOMP: 'LabComp',
  MP53: 'MP 53'
} as const;

export const CURRENT_SEMESTER = '2025.2';

// Utilitário para gerar slots de tempo
export const generateTimeSlots = (startTime: string, endTime: string): string[] => {
  const slots: string[] = [];
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  
  while (start < end) {
    slots.push(start.toTimeString().slice(0, 5));
    start.setMinutes(start.getMinutes() + 30);
  }
  
  return slots;
};

// Utilitário para obter datas de um dia da semana até o final do semestre
export const getRecurringDates = (dayOfWeek: number, startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Encontrar a primeira ocorrência do dia da semana
  const firstDate = new Date(start);
  const daysUntilTarget = (dayOfWeek - firstDate.getDay() + 7) % 7;
  firstDate.setDate(firstDate.getDate() + daysUntilTarget);
  
  // Adicionar todas as ocorrências até o final
  while (firstDate <= end) {
    dates.push(firstDate.toISOString().split('T')[0]);
    firstDate.setDate(firstDate.getDate() + 7);
  }
  
  return dates;
};