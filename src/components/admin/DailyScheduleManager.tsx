import { useState } from 'react';
import { Calendar, Plus, Save, Trash2, Download, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useDailySchedules } from '../../hooks/useDailySchedules';
import { exportDailySchedulesToExcel, exportMonthlySchedulesToExcel } from '../../lib/excelExport';
import type { DailySchedule } from '../../types/lab';

export function DailyScheduleManager() {
  const { 
    dailySchedules, 
    loading, 
    error, 
    updateDailySchedule, 
    deleteDailySchedule, 
    generateSchedulesForMonth 
  } = useDailySchedules();
  
  const [newSchedule, setNewSchedule] = useState<DailySchedule>({
    date: '',
    start: '12:00',
    end: '18:00',
    active: true,
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleSaveSchedule = async () => {
    if (!newSchedule.date) {
      setMessage('Por favor, selecione uma data');
      return;
    }

    setUpdating(true);
    setMessage('');

    try {
      const result = await updateDailySchedule(newSchedule.date, newSchedule);
      if (result.success) {
        setMessage('Horário salvo com sucesso!');
        setNewSchedule({
          date: '',
          start: '12:00',
          end: '18:00',
          active: true,
          notes: ''
        });
      } else {
        setMessage(`Erro: ${result.error}`);
      }
    } catch {
      setMessage('Erro inesperado ao salvar horário');
    }

    setUpdating(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteSchedule = async (dateKey: string) => {
    if (!confirm('Tem certeza que deseja excluir este horário?')) {
      return;
    }

    setUpdating(true);
    setMessage('');

    try {
      const result = await deleteDailySchedule(dateKey);
      if (result.success) {
        setMessage('Horário excluído com sucesso!');
      } else {
        setMessage(`Erro: ${result.error}`);
      }
    } catch {
      setMessage('Erro inesperado ao excluir horário');
    }

    setUpdating(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleGenerateMonth = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    setUpdating(true);
    setMessage('');

    try {
      const result = await generateSchedulesForMonth(year, month);
      if (result.success) {
        setMessage('Horários do mês gerados com sucesso!');
      } else {
        setMessage(`Erro: ${result.error}`);
      }
    } catch {
      setMessage('Erro inesperado ao gerar horários');
    }

    setUpdating(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleExportAll = () => {
    const result = exportDailySchedulesToExcel(dailySchedules);
    if (result.success) {
      setMessage(`Excel exportado: ${result.fileName}`);
    } else {
      setMessage(`Erro: ${result.error}`);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleExportMonth = () => {
    const now = new Date();
    const result = exportMonthlySchedulesToExcel(
      dailySchedules, 
      now.getFullYear(), 
      now.getMonth()
    );
    if (result.success) {
      setMessage(`Excel do mês exportado: ${result.fileName}`);
    } else {
      setMessage(`Erro: ${result.error}`);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-uefs-primary mx-auto mb-4"></div>
            <p className="text-uefs-gray-600">Carregando horários...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedSchedules = Object.entries(dailySchedules).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-uefs-primary/5 to-uefs-secondary/5 border-uefs-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-uefs-primary to-uefs-secondary rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span>Gerenciar Horários Diários</span>
          </CardTitle>
          <CardDescription className="text-lg">
            Configure horários específicos para cada dia do calendário
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              onClick={handleGenerateMonth}
              disabled={updating}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Gerar Mês Atual</span>
            </Button>
            <Button
              onClick={handleExportAll}
              disabled={updating}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Todos</span>
            </Button>
            <Button
              onClick={handleExportMonth}
              disabled={updating}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Mês</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add New Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Adicionar/Editar Horário</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={newSchedule.date}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, date: e.target.value }))}
                disabled={updating}
              />
            </div>
            <div>
              <Label htmlFor="start">Início</Label>
              <Input
                id="start"
                type="time"
                value={newSchedule.start}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, start: e.target.value }))}
                disabled={updating}
              />
            </div>
            <div>
              <Label htmlFor="end">Fim</Label>
              <Input
                id="end"
                type="time"
                value={newSchedule.end}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, end: e.target.value }))}
                disabled={updating}
              />
            </div>
            <div>
              <Label htmlFor="active">Status</Label>
              <select
                id="active"
                value={newSchedule.active ? 'true' : 'false'}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, active: e.target.value === 'true' }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={updating}
              >
                <option value="true">Funcionando</option>
                <option value="false">Fechado</option>
              </select>
            </div>
            <div>
              <Label htmlFor="save" className="invisible">Salvar</Label>
              <Button
                id="save"
                onClick={handleSaveSchedule}
                disabled={updating}
                className="w-full flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Input
              id="notes"
              value={newSchedule.notes}
              onChange={(e) => setNewSchedule(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Ex: Horário especial de feriado"
              disabled={updating}
            />
          </div>
        </CardContent>
      </Card>

      {/* Existing Schedules */}
      <Card>
        <CardHeader>
          <CardTitle>Horários Cadastrados ({sortedSchedules.length})</CardTitle>
          <CardDescription>
            {error && <span className="text-red-600">{error}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedSchedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum horário cadastrado. Use "Gerar Mês Atual" para começar.
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sortedSchedules.map(([dateKey, schedule]) => {
                const date = new Date(dateKey);
                return (
                  <div 
                    key={dateKey}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-medium">
                        {date.toLocaleDateString('pt-BR', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long' 
                        })}
                      </div>
                      <div className="text-sm text-gray-600">
                        {schedule.active 
                          ? `${schedule.start} - ${schedule.end}` 
                          : 'Fechado'
                        }
                        {schedule.notes && ` • ${schedule.notes}`}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        schedule.active ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <Button
                        onClick={() => setNewSchedule({
                          date: dateKey,
                          start: schedule.start,
                          end: schedule.end,
                          active: schedule.active,
                          notes: schedule.notes || ''
                        })}
                        size="sm"
                        variant="outline"
                        disabled={updating}
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDeleteSchedule(dateKey)}
                        size="sm"
                        variant="destructive"
                        disabled={updating}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages */}
      {message && (
        <Card>
          <CardContent className="pt-6">
            <div className={`text-center p-3 rounded ${
              message.includes('sucesso') || message.includes('exportado')
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}