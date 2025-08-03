import { Clock, MapPin, Phone, Computer, User, Shield, GraduationCap, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  currentStatus: 'open' | 'closed' | 'maintenance';
}

export function Header({ currentStatus }: HeaderProps) {
  const { user, logout } = useAuth();
  
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

  const handleLogout = async () => {
    await logout();
  };

  const getUserTypeIcon = () => {
    if (!user) return null;
    return user.profile?.tipoUsuario === 'administrador' 
      ? <Shield className="w-4 h-4 text-yellow-500" />
      : <GraduationCap className="w-4 h-4 text-blue-500" />;
  };

  const getUserTypeBadge = () => {
    if (!user) return null;
    return user.profile?.tipoUsuario === 'administrador' 
      ? <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full border border-yellow-200">Admin</span>
      : <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full border border-blue-200">Professor</span>;
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
            {/* User Info */}
            {user && (
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-white" />
                  <div className="text-sm text-white">
                    <p className="font-medium">{user.profile?.nome || user.displayName}</p>
                    <div className="flex items-center space-x-2">
                      {getUserTypeIcon()}
                      {getUserTypeBadge()}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white flex items-center space-x-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sair</span>
                </Button>
              </div>
            )}
            
            {/* Status Badge */}
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