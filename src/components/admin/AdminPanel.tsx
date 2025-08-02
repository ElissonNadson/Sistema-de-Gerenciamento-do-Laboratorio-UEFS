import { useState } from 'react';
import { Settings, LogOut, AlertTriangle, Clock, MessageSquare } from 'lucide-react';
import type { LabConfig, User } from '../../types/lab';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ScheduleEditor } from './ScheduleEditor';

interface AdminPanelProps {
  user: User;
  config: LabConfig;
  onLogout: () => void;
  onUpdateConfig: (updates: Partial<LabConfig>) => Promise<{ success: boolean; error: string | null }>;
}

export function AdminPanel({ user, config, onLogout, onUpdateConfig }: AdminPanelProps) {
  const [specialAlert, setSpecialAlert] = useState(config.specialAlert);
  const [status, setStatus] = useState(config.status);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const handleStatusUpdate = async (newStatus: 'open' | 'closed' | 'maintenance') => {
    setUpdating(true);
    setMessage('');

    try {
      const result = await onUpdateConfig({ status: newStatus });
      if (result.success) {
        setStatus(newStatus);
        setMessage('Status atualizado com sucesso!');
      } else {
        setMessage(`Erro: ${result.error}`);
      }
    } catch {
      setMessage('Erro inesperado ao atualizar status');
    }

    setUpdating(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAlertUpdate = async () => {
    setUpdating(true);
    setMessage('');

    try {
      const result = await onUpdateConfig({ specialAlert });
      if (result.success) {
        setMessage('Aviso atualizado com sucesso!');
      } else {
        setMessage(`Erro: ${result.error}`);
      }
    } catch {
      setMessage('Erro inesperado ao atualizar aviso');
    }

    setUpdating(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case 'open':
        return 'bg-green-500 hover:bg-green-600';
      case 'maintenance':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-red-500 hover:bg-red-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Painel Administrativo</span>
              </CardTitle>
              <CardDescription>
                Logado como: {user.email}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onLogout} className="mt-4 md:mt-0">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Status Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Controle de Status</span>
          </CardTitle>
          <CardDescription>
            Altere o status atual do laboratório
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => handleStatusUpdate('open')}
              disabled={updating || status === 'open'}
              className={`${getStatusColor('open')} text-white`}
              variant={status === 'open' ? 'default' : 'outline'}
            >
              🟢 Aberto
            </Button>
            <Button
              onClick={() => handleStatusUpdate('maintenance')}
              disabled={updating || status === 'maintenance'}
              className={`${getStatusColor('maintenance')} text-white`}
              variant={status === 'maintenance' ? 'default' : 'outline'}
            >
              🟡 Manutenção
            </Button>
            <Button
              onClick={() => handleStatusUpdate('closed')}
              disabled={updating || status === 'closed'}
              className={`${getStatusColor('closed')} text-white`}
              variant={status === 'closed' ? 'default' : 'outline'}
            >
              🔴 Fechado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Special Alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Aviso Especial</span>
          </CardTitle>
          <CardDescription>
            Crie avisos importantes que aparecerão na página principal
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="special-alert">Mensagem do Aviso</Label>
            <Input
              id="special-alert"
              value={specialAlert}
              onChange={(e) => setSpecialAlert(e.target.value)}
              placeholder="Digite um aviso especial (deixe vazio para remover)"
              disabled={updating}
            />
          </div>
          <Button 
            onClick={handleAlertUpdate}
            disabled={updating}
            className="flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{updating ? 'Salvando...' : 'Salvar Aviso'}</span>
          </Button>
        </CardContent>
      </Card>

      {/* Schedule Editor */}
      <ScheduleEditor config={config} onSave={onUpdateConfig} />

      {/* Messages */}
      {message && (
        <Card>
          <CardContent className="pt-6">
            <div className={`text-center p-3 rounded ${
              message.includes('sucesso') 
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