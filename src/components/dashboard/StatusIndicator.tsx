import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'open' | 'closed' | 'maintenance';
  className?: string;
}

export function StatusIndicator({ status, className = '' }: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'open':
        return {
          icon: CheckCircle,
          text: 'Laboratório Aberto',
          description: 'Funcionando normalmente',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          borderColor: 'border-green-200'
        };
      case 'maintenance':
        return {
          icon: AlertCircle,
          text: 'Em Manutenção',
          description: 'Temporariamente indisponível',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          borderColor: 'border-yellow-200'
        };
      default:
        return {
          icon: Clock,
          text: 'Laboratório Fechado',
          description: 'Fora do horário de funcionamento',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          borderColor: 'border-red-200'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border p-6 text-center ${config.bgColor} ${config.borderColor} ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <Icon className={`w-12 h-12 ${config.iconColor}`} />
        <div>
          <h3 className={`text-xl font-bold ${config.textColor}`}>
            {config.text}
          </h3>
          <p className={`text-sm ${config.textColor} opacity-80 mt-1`}>
            {config.description}
          </p>
        </div>
      </div>
    </div>
  );
}