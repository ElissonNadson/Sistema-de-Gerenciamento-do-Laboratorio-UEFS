import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { DailySchedule } from '../types/lab';

export function useDailySchedules() {
  const [dailySchedules, setDailySchedules] = useState<{ [dateKey: string]: DailySchedule }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'lab', 'dailySchedules'),
      (doc) => {
        if (doc.exists()) {
          setDailySchedules(doc.data() as { [dateKey: string]: DailySchedule });
        } else {
          setDailySchedules({});
        }
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching daily schedules:', error);
        setError('Erro ao carregar horários diários');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const updateDailySchedule = async (dateKey: string, schedule: DailySchedule) => {
    try {
      const updatedSchedules = {
        ...dailySchedules,
        [dateKey]: schedule
      };
      
      await updateDoc(doc(db, 'lab', 'dailySchedules'), updatedSchedules);
      return { success: true, error: null };
    } catch (error: unknown) {
      console.error('Error updating daily schedule:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  };

  const deleteDailySchedule = async (dateKey: string) => {
    try {
      const updatedSchedules = { ...dailySchedules };
      delete updatedSchedules[dateKey];
      
      await updateDoc(doc(db, 'lab', 'dailySchedules'), updatedSchedules);
      return { success: true, error: null };
    } catch (error: unknown) {
      console.error('Error deleting daily schedule:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  };

  const generateSchedulesForMonth = async (year: number, month: number) => {
    try {
      const newSchedules = { ...dailySchedules };
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateKey = date.toISOString().split('T')[0];
        
        // Skip weekends (Saturday = 6, Sunday = 0)
        if (date.getDay() === 0 || date.getDay() === 6) {
          continue;
        }
        
        // Don't overwrite existing schedules
        if (newSchedules[dateKey]) {
          continue;
        }
        
        // Set default schedule based on day of week
        const dayOfWeek = date.getDay();
        let defaultSchedule: DailySchedule;
        
        if (dayOfWeek === 5) { // Friday
          defaultSchedule = {
            date: dateKey,
            start: '08:00',
            end: '14:00',
            active: true,
            notes: 'Horário de sexta-feira'
          };
        } else { // Monday to Thursday
          defaultSchedule = {
            date: dateKey,
            start: '12:00',
            end: '18:00',
            active: true,
            notes: 'Horário padrão'
          };
        }
        
        newSchedules[dateKey] = defaultSchedule;
      }
      
      await updateDoc(doc(db, 'lab', 'dailySchedules'), newSchedules);
      return { success: true, error: null };
    } catch (error: unknown) {
      console.error('Error generating monthly schedules:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  };

  return { 
    dailySchedules, 
    loading, 
    error, 
    updateDailySchedule, 
    deleteDailySchedule,
    generateSchedulesForMonth
  };
}