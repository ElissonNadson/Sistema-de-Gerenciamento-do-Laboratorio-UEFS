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
          bgColor: 'bg-uefs-accent/10',
          textColor: 'text-uefs-accent',
          iconColor: 'text-uefs-accent',
          borderColor: 'border-uefs-accent/20',
          shadowColor: 'shadow-uefs'
        };
      case 'maintenance':
        return {
          icon: AlertCircle,
          text: 'Em Manutenção',
          description: 'Temporariamente indisponível',
          bgColor: 'bg-uefs-warning/10',
          textColor: 'text-uefs-warning',
          iconColor: 'text-uefs-warning',
          borderColor: 'border-uefs-warning/20',
          shadowColor: 'shadow-uefs'
        };
      default:
        return {
          icon: Clock,
          text: 'Laboratório Fechado',
          description: 'Fora do horário de funcionamento',
          bgColor: 'bg-uefs-danger/10',
          textColor: 'text-uefs-danger',
          iconColor: 'text-uefs-danger',
          borderColor: 'border-uefs-danger/20',
          shadowColor: 'shadow-uefs'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-8 text-center bg-white ${config.bgColor} ${config.borderColor} ${config.shadowColor} transition-all duration-300 hover:scale-105 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className={`p-3 rounded-full ${config.bgColor} border ${config.borderColor}`}>
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </div>
        <div>
          <h3 className={`text-2xl font-bold ${config.textColor} mb-2`}>
            {config.text}
          </h3>
          <p className={`text-sm ${config.textColor} opacity-80 font-medium`}>
            {config.description}
          </p>
        </div>
        
        {/* Status indicator pulse animation */}
        {status === 'open' && (
          <div className="relative">
            <div className="w-3 h-3 bg-uefs-accent rounded-full animate-pulse"></div>
            <div className="absolute top-0 left-0 w-3 h-3 bg-uefs-accent rounded-full animate-ping"></div>
          </div>
        )}
      </div>
    </div>
  );
}