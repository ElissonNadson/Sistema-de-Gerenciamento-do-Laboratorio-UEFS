import { useState, useEffect } from 'react';
import type { LabConfig } from '../types/lab';
import { getCurrentDay, getCurrentTime, isTimeInRange } from '../lib/timeUtils';

export function useRealTimeStatus(config: LabConfig) {
  const [currentStatus, setCurrentStatus] = useState<'open' | 'closed' | 'maintenance'>('closed');

  useEffect(() => {
    const updateStatus = () => {
      // Se o status manual for manutenção, manter manutenção
      if (config.status === 'maintenance') {
        setCurrentStatus('maintenance');
        return;
      }

      // Se o status manual for fechado, manter fechado
      if (config.status === 'closed') {
        setCurrentStatus('closed');
        return;
      }

      // Para status 'open', verificar se realmente está no horário de funcionamento
      const currentDay = getCurrentDay();
      const currentTime = getCurrentTime();
      const daySchedule = config.schedule[currentDay];

      if (daySchedule.active && isTimeInRange(currentTime, daySchedule.start, daySchedule.end)) {
        setCurrentStatus('open');
      } else {
        setCurrentStatus('closed');
      }
    };

    updateStatus();
    
    // Atualizar status a cada minuto
    const interval = setInterval(updateStatus, 60000);

    return () => clearInterval(interval);
  }, [config]);

  return currentStatus;
}