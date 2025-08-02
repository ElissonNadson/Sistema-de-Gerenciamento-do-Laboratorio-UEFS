import { Clock, MapPin, Phone } from 'lucide-react';

interface HeaderProps {
  currentStatus: 'open' | 'closed' | 'maintenance';
}

export function Header({ currentStatus }: HeaderProps) {
  const getStatusColor = () => {
    switch (currentStatus) {
      case 'open':
        return 'text-green-600';
      case 'maintenance':
        return 'text-yellow-600';
      default:
        return 'text-red-600';
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
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Laboratório de Computação
              </h1>
              <p className="text-blue-100">
                Universidade Estadual de Feira de Santana - UEFS
              </p>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end space-y-2">
            <div className={`text-lg font-semibold ${getStatusColor()} bg-white px-3 py-1 rounded-full`}>
              {getStatusText()}
            </div>
            <div className="flex items-center space-x-4 text-sm text-blue-100">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Atualizado em tempo real</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-100">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Campus Universitário, Prédio de Computação</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Contato: lab.computacao@uefs.br</span>
          </div>
        </div>
      </div>
    </header>
  );
}