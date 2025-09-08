import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc, 
  writeBatch 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Reservation, ReservationRequest, ScheduleFilters } from '../types/reservations';
import { generateTimeSlots, getRecurringDates, CURRENT_SEMESTER } from '../types/reservations';

export interface UseReservationsReturn {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  createReservation: (request: ReservationRequest) => Promise<string>;
  createRecurringReservations: (request: ReservationRequest) => Promise<string[]>;
  updateReservationStatus: (id: string, status: 'approved' | 'rejected' | 'awaiting_department_confirmation', adminId: string, reason?: string) => Promise<void>;
  getAvailableSlots: (date: string, classroom?: string) => string[];
  getReservationsByDate: (date: string, classroom?: string) => Reservation[];
  getReservationsByUser: (userEmail: string) => Reservation[];
  filterReservations: (filters: ScheduleFilters) => Reservation[];
  departmentConfirmReservation: (id: string, confirmedBy: string) => Promise<void>;
}

export const useReservations = (): UseReservationsReturn => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'reservations'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const reservationsData: Reservation[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          approvedAt: doc.data().approvedAt?.toDate() || undefined,
          departmentConfirmedAt: doc.data().departmentConfirmedAt?.toDate() || undefined,
        })) as Reservation[];

        setReservations(reservationsData);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar reservas');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const createReservation = async (request: ReservationRequest): Promise<string> => {
    try {
      setError(null);
      
      // Gerar slots de tempo baseado no horário de início e fim
      const timeSlots = generateTimeSlots(request.startTime, request.endTime);
      
      let dates: string[] = [];
      
      // Determinar as datas baseado no tipo de reserva
      if (request.reservationType === 'single' && request.date) {
        dates = [request.date];
      } else if (request.reservationType === 'specific_dates' && request.dates) {
        dates = request.dates;
      } else if (request.reservationType === 'recurring' && request.dayOfWeek !== undefined && request.startDate && request.endDate) {
        dates = getRecurringDates(request.dayOfWeek, request.startDate, request.endDate);
      }

      const reservationData = {
        ...request,
        timeSlots,
        dates,
        status: 'awaiting_department_confirmation' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        semester: request.semester || CURRENT_SEMESTER
      };

      // Se for múltiplas datas, criar reservas separadas mas agrupadas
      if (dates.length > 1) {
        const ids = await createRecurringReservations(request);
        return ids[0]; // Retorna o primeiro ID
      } else {
        // Reserva única
        const docRef = await addDoc(collection(db, 'reservations'), reservationData);
        return docRef.id;
      }
    } catch (err) {
      const errorMessage = 'Erro ao criar reserva';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const createRecurringReservations = async (request: ReservationRequest): Promise<string[]> => {
    try {
      setError(null);
      
      let dates: string[] = [];
      
      if (request.reservationType === 'specific_dates' && request.dates) {
        dates = request.dates;
      } else if (request.reservationType === 'recurring' && request.dayOfWeek !== undefined && request.startDate && request.endDate) {
        dates = getRecurringDates(request.dayOfWeek, request.startDate, request.endDate);
      }

      if (dates.length === 0) {
        throw new Error('Nenhuma data válida fornecida');
      }

      const batch = writeBatch(db);
      const groupId = `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timeSlots = generateTimeSlots(request.startTime, request.endTime);
      const docIds: string[] = [];

      dates.forEach((date) => {
        const docRef = doc(collection(db, 'reservations'));
        docIds.push(docRef.id);
        
        const reservationData = {
          ...request,
          dates: [date], // Cada reserva tem uma data específica
          timeSlots,
          status: 'awaiting_department_confirmation' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
          semester: request.semester || CURRENT_SEMESTER,
          isRecurring: dates.length > 1,
          recurringGroupId: dates.length > 1 ? groupId : undefined,
          reservationType: request.reservationType
        };

        batch.set(docRef, reservationData);
      });

      await batch.commit();
      return docIds;
    } catch (err) {
      const errorMessage = 'Erro ao criar reservas recorrentes';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateReservationStatus = async (
    id: string, 
    status: 'approved' | 'rejected' | 'awaiting_department_confirmation', 
    adminId: string, 
    reason?: string
  ): Promise<void> => {
    try {
      setError(null);
      
      const updateData: any = {
        status,
        updatedAt: new Date(),
        approvedBy: adminId,
      };

      if (status === 'approved') {
        updateData.approvedAt = new Date();
      } else if (status === 'rejected' && reason) {
        updateData.rejectionReason = reason;
      }

      await updateDoc(doc(db, 'reservations', id), updateData);
    } catch (err) {
      const errorMessage = 'Erro ao atualizar status da reserva';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const departmentConfirmReservation = async (id: string, confirmedBy: string): Promise<void> => {
    try {
      setError(null);
      
      const updateData = {
        status: 'approved' as const,
        departmentConfirmedBy: confirmedBy,
        departmentConfirmedAt: new Date(),
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, 'reservations', id), updateData);
    } catch (err) {
      const errorMessage = 'Erro ao confirmar reserva pelo departamento';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getAvailableSlots = (date: string, classroom: string = 'LabComp'): string[] => {
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    if (isWeekend) {
      return [];
    }

    // Todos os slots disponíveis (30 em 30 minutos)
    const allSlots: string[] = [];
    
    // Manhã: 07:30 - 12:30
    for (let hour = 7; hour < 12; hour++) {
      allSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      if (hour < 11) {
        allSlots.push(`${(hour + 1).toString().padStart(2, '0')}:00`);
      }
    }
    allSlots.push('12:00');
    
    // Tarde: 13:30 - 18:30
    for (let hour = 13; hour < 18; hour++) {
      allSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      if (hour < 17) {
        allSlots.push(`${(hour + 1).toString().padStart(2, '0')}:00`);
      }
    }
    allSlots.push('18:00');
    
    // Noite: 18:30 - 23:30
    for (let hour = 18; hour < 23; hour++) {
      allSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      if (hour < 22) {
        allSlots.push(`${(hour + 1).toString().padStart(2, '0')}:00`);
      }
    }
    allSlots.push('23:00');

    // Remover horários já reservados
    const dateReservations = getReservationsByDate(date, classroom);
    const reservedSlots = new Set<string>();
    
    dateReservations
      .filter(r => r.status === 'approved')
      .forEach(r => {
        if (r.timeSlots) {
          r.timeSlots.forEach(slot => reservedSlots.add(slot));
        }
      });

    return allSlots.filter(slot => !reservedSlots.has(slot));
  };

  const getReservationsByDate = (date: string, classroom?: string): Reservation[] => {
    return reservations.filter(reservation => {
      const hasDate = reservation.dates?.includes(date) || false;
      const matchesClassroom = !classroom || reservation.classroom === classroom;
      return hasDate && matchesClassroom;
    });
  };

  const getReservationsByUser = (userEmail: string): Reservation[] => {
    return reservations.filter(reservation => reservation.userEmail === userEmail);
  };

  const filterReservations = (filters: ScheduleFilters): Reservation[] => {
    return reservations.filter(reservation => {
      // Verificar se alguma data da reserva está no período
      const hasDateInRange = reservation.dates?.some(date => {
        const reservationDate = new Date(date);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        return reservationDate >= startDate && reservationDate <= endDate;
      });

      if (!hasDateInRange) {
        return false;
      }

      if (filters.userType && reservation.userType !== filters.userType) {
        return false;
      }

      if (filters.status && reservation.status !== filters.status) {
        return false;
      }

      if (filters.course && reservation.course !== filters.course) {
        return false;
      }

      if (filters.classroom && reservation.classroom !== filters.classroom) {
        return false;
      }

      if (filters.semester && reservation.semester !== filters.semester) {
        return false;
      }

      return true;
    });
  };

  return {
    reservations,
    loading,
    error,
    createReservation,
    createRecurringReservations,
    updateReservationStatus,
    getAvailableSlots,
    getReservationsByDate,
    getReservationsByUser,
    filterReservations,
    departmentConfirmReservation,
  };
};
