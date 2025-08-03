import { Clock, MapPin, Phone, Computer } from 'lucide-react';

interface HeaderProps {
  currentStatus: 'open' | 'closed' | 'maintenance';
}

export function Header({ currentStatus }: HeaderProps) {
  const getStatusColor = () => {
    switch (currentStatus) {
      case 'open':
        return 'text-uefs-accent bg-uefs-accent/10 border-uefs-accent/20';
      case 'maintenance':
        return 'text-uefs-warning bg-uefs-warning/10 border-uefs-warning/20';
      default:
        return 'text-uefs-danger bg-uefs-danger/10 border-uefs-danger/20';
    }
  };

  const getStatusText = () => {
    switch (currentStatus) {
      case 'open':
        return '🟢 Aberto';
      case 'maintenance':
        return '🟡 Manutenção';
      default:
        return '🔴 Fechado';
    }
  };

  return (
    <header className="bg-gradient-to-r from-uefs-primary via-uefs-secondary to-uefs-dark text-white shadow-uefs-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg backdrop-blur-sm">
              <Computer className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                Laboratório de Computação
              </h1>
              <p className="text-white/90 font-medium">
                Universidade Estadual de Feira de Santana - UEFS
              </p>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end space-y-3">
            <div className={`text-lg font-semibold px-4 py-2 rounded-full border ${getStatusColor()} bg-white`}>
              {getStatusText()}
            </div>
            <div className="flex items-center space-x-4 text-sm text-white/80">
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <Clock className="w-4 h-4" />
                <span>Atualizado em tempo real</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 text-sm text-white/90 bg-white/10 px-4 py-3 rounded-lg backdrop-blur-sm">
            <MapPin className="w-5 h-5 text-uefs-accent" />
            <span className="font-medium">Campus Universitário, Prédio de Computação</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-white/90 bg-white/10 px-4 py-3 rounded-lg backdrop-blur-sm">
            <Phone className="w-5 h-5 text-uefs-accent" />
            <span className="font-medium">Contato: lab.computacao@uefs.br</span>
          </div>
        </div>
      </div>
    </header>
  );
}