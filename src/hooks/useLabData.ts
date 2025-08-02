import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { LabConfig } from '../types/lab';

const defaultConfig: LabConfig = {
  status: 'closed',
  specialAlert: '',
  schedule: {
    monday: { start: '12:00', end: '18:00', active: true },
    tuesday: { start: '12:00', end: '18:00', active: true },
    wednesday: { start: '12:00', end: '18:00', active: true },
    thursday: { start: '12:00', end: '18:00', active: true },
    friday: { start: '08:00', end: '14:00', active: true },
    saturday: { start: '', end: '', active: false },
    sunday: { start: '', end: '', active: false }
  },
  lastUpdate: new Date().toISOString()
};

export function useLabData() {
  const [config, setConfig] = useState<LabConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'lab', 'config'),
      (doc) => {
        if (doc.exists()) {
          setConfig(doc.data() as LabConfig);
        } else {
          setConfig(defaultConfig);
        }
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching lab data:', error);
        setError('Erro ao carregar dados do laboratório');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const updateConfig = async (updates: Partial<LabConfig>) => {
    try {
      const updatedConfig = {
        ...config,
        ...updates,
        lastUpdate: new Date().toISOString()
      };
      
      await updateDoc(doc(db, 'lab', 'config'), updatedConfig);
      return { success: true, error: null };
    } catch (error: unknown) {
      console.error('Error updating lab config:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  };

  return { config, loading, error, updateConfig };
}