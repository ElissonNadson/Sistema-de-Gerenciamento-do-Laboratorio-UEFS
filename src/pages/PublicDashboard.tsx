import { useState } from 'react';
import { Settings, User, LogIn } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ScheduleGrid } from '../components/dashboard/ScheduleGrid';
import { StatusIndicator } from '../components/dashboard/StatusIndicator';
import { AlertBanner } from '../components/dashboard/AlertBanner';
import { ModernCalendar } from '../components/dashboard/ModernCalendar';
import { AuthModal } from '../components/auth/AuthModal';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { useLabData } from '../hooks/useLabData';
import { useRealTimeStatus } from '../hooks/useRealTimeStatus';
import { useNavigate } from 'react-router-dom';

export function PublicDashboard() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  
  const { user, logout } = useAuth();
  const { config, loading: dataLoading, error } = useLabData();
  const currentStatus = useRealTimeStatus(config);
  const navigate = useNavigate();

  const isLoading = dataLoading;

  // Generate sample available dates for the calendar (next 30 days, excluding weekends)
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  }).filter(date => date.getDay() !== 0 && date.getDay() !== 6); // Exclude weekends

  const handleLogout = async () => {
    await logout();
    setShowAuthModal(false);
  };

  const handleAdminAccess = () => {
    if (user) {
      // User is already authenticated, they can navigate to admin
      navigate('/admin');
    } else {
      // Show auth modal for login
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // After successful login, redirect to admin if user is admin
    if (user?.profile?.tipoUsuario === 'administrador') {
      navigate('/admin');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uefs-gray-50 to-uefs-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-uefs-primary mx-auto mb-4"></div>
          <p className="text-uefs-gray-600">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uefs-gray-50 to-uefs-primary/5 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-uefs-danger text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-uefs-dark mb-2">Erro de Conexão</h1>
          <p className="text-uefs-gray-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-uefs-primary hover:bg-uefs-dark"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-uefs-gray-50 to-uefs-primary/5">
      <Header currentStatus={currentStatus} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Special Alert Banner */}
        {config.specialAlert && (
          <AlertBanner 
            message={config.specialAlert}
            variant="warning"
          />
        )}
        
        {/* Current Status */}
        <div className="mb-8">
          <StatusIndicator status={currentStatus} />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <ModernCalendar
              availableDates={availableDates}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>
          
          {/* Schedule Grid */}
          <div className="lg:col-span-2">
            <ScheduleGrid config={config} selectedDate={selectedDate} />
          </div>
        </div>
        
        {/* Last Update */}
        <div className="text-center text-sm text-uefs-gray-500 mb-8">
          Última atualização: {new Date(config.lastUpdate).toLocaleString('pt-BR')}
        </div>
      </main>
      
      <Footer />
      
      {/* User Status Indicator and Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-3">
        {user && (
          <div className="bg-white rounded-lg shadow-lg p-3 flex items-center space-x-3 border">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-uefs-primary" />
              <div className="text-sm">
                <p className="font-medium text-uefs-dark">{user.profile?.nome || user.displayName}</p>
                <p className="text-xs text-uefs-gray-600 capitalize">{user.profile?.tipoUsuario}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1"
            >
              <LogIn className="w-3 h-3" />
              <span>Sair</span>
            </Button>
          </div>
        )}
        
        {/* Admin Access Button */}
        <Button
          onClick={handleAdminAccess}
          className="rounded-full w-14 h-14 shadow-uefs-lg bg-uefs-primary hover:bg-uefs-dark transition-all duration-300 hover:scale-110"
          size="icon"
          title={user ? "Acessar Painel Admin" : "Login Admin"}
        >
          <Settings className="w-6 h-6" />
        </Button>
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        defaultMode="login"
      />
    </div>
  );
}