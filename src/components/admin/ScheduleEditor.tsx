import { useState } from 'react';
import type { LabConfig, DayOfWeek } from '../../types/lab';
import { formatDayName } from '../../lib/timeUtils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Clock, Save } from 'lucide-react';

interface ScheduleEditorProps {
  config: LabConfig;
  onSave: (updates: Partial<LabConfig>) => Promise<{ success: boolean; error: string | null }>;
}

export function ScheduleEditor({ config, onSave }: ScheduleEditorProps) {
  const [schedule, setSchedule] = useState(config.schedule);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleTimeChange = (day: DayOfWeek, field: 'start' | 'end', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleActiveChange = (day: DayOfWeek, active: boolean) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        active,
        start: active ? prev[day].start : '',
        end: active ? prev[day].end : ''
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const result = await onSave({ schedule });
      if (result.success) {
        setMessage('Horários salvos com sucesso!');
      } else {
        setMessage(`Erro: ${result.error}`);
      }
    } catch {
      setMessage('Erro inesperado ao salvar');
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Editor de Horários</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {days.map((day) => (
            <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 border rounded-lg">
              <div className="md:col-span-1">
                <Label className="text-base font-semibold">
                  {formatDayName(day)}
                </Label>
              </div>
              
              <div className="md:col-span-1 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`active-${day}`}
                  checked={schedule[day].active}
                  onChange={(e) => handleActiveChange(day, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor={`active-${day}`} className="text-sm">
                  Funciona
                </Label>
              </div>
              
              <div className="md:col-span-2 grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`start-${day}`} className="text-xs text-gray-600">
                    Início
                  </Label>
                  <Input
                    id={`start-${day}`}
                    type="time"
                    value={schedule[day].start}
                    onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                    disabled={!schedule[day].active}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor={`end-${day}`} className="text-xs text-gray-600">
                    Fim
                  </Label>
                  <Input
                    id={`end-${day}`}
                    type="time"
                    value={schedule[day].end}
                    onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                    disabled={!schedule[day].active}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {message && (
          <div className={`text-center p-2 rounded ${
            message.includes('sucesso') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : 'Salvar Horários'}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}