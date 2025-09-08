import { useState } from 'react';
import { Settings, User, LogIn } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ScheduleGrid } from '../components/dashboard/ScheduleGrid';
import { StatusIndicator } from '../components/dashboard/StatusIndicator';
import { AlertBanner } from '../components/dashboard/AlertBanner';
import { ModernCalendar } from '../components/dashboard/ModernCalendar';
import { ClassScheduleView } from '../components/reservations/ClassScheduleView';
import { AuthModal } from '../components/auth/AuthModal';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { useLabData } from '../hooks/useLabData';
import { useDailySchedules } from '../hooks/useDailySchedules';
import { useRealTimeStatus } from '../hooks/useRealTimeStatus';
import { useReservations } from '../hooks/useReservations';
import { useNavigate } from 'react-router-dom';

export function PublicDashboard() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  
  const { user, logout } = useAuth();
  const { config, loading: dataLoading, error } = useLabData();
  const { dailySchedules, loading: schedulesLoading } = useDailySchedules();
  const { loading: reservationsLoading } = useReservations();
  const currentStatus = useRealTimeStatus(config);
  const navigate = useNavigate();

  const isLoading = dataLoading || schedulesLoading || reservationsLoading;

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
    <div className="min-h-screen bg-gradient-to-br from-uefs-gray-50 via-white to-uefs-primary/5">
      <Header currentStatus={currentStatus} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-uefs-primary to-uefs-secondary py-6">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="hero-title font-bold text-white mb-3">
            Laboratório de Computação
          </h1>
          <p className="hero-subtitle text-uefs-gray-100 mb-4">
            Sistema de Gerenciamento - UEFS
          </p>
          <div className="flex justify-center items-center space-x-4">
            <div className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
              📍 Feira de Santana, BA
            </div>
            <div className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
              🎓 Universidade Estadual de Feira de Santana
            </div>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        {/* Special Alert Banner */}
        {config.specialAlert && (
          <div className="mb-8 animate-pulse">
            <AlertBanner 
              message={config.specialAlert}
              variant="warning"
            />
          </div>
        )}
        
        {/* Current Status */}
        <div className="mb-8">
          <StatusIndicator status={currentStatus} />
        </div>

        {/* Seção: Status e Calendário */}
        <section className="mb-12">
          <div className="border-b border-gray-200 pb-2 mb-6">
            <h2 className="text-xl font-bold text-uefs-dark">📊 Visão Geral</h2>
            <p className="text-sm text-gray-600">Status atual e cronograma do laboratório</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-1">
              <ModernCalendar
                dailySchedules={dailySchedules}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
            
            {/* Schedule Grid */}
            <div className="lg:col-span-2">
              <ScheduleGrid 
                config={config} 
                selectedDate={selectedDate} 
                dailySchedules={dailySchedules}
              />
            </div>
          </div>
        </section>

        {/* Seção: Aulas e Reservas */}
        <section className="mb-12">
          <div className="border-b border-gray-200 pb-2 mb-6">
            <h2 className="text-xl font-bold text-uefs-dark">📅 Aulas e Horários</h2>
            <p className="text-sm text-gray-600">Calendário de aulas confirmadas e sistema de reservas</p>
          </div>
          <Card className="p-6 border border-gray-200">
            {!user && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-blue-800 mb-3 text-sm">
                  💡 Faça login para acessar o sistema de reservas
                </p>
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 text-white text-sm px-6 py-2"
                >
                  Fazer Login
                </Button>
              </div>
            )}
            
            <ClassScheduleView
              selectedDate={selectedDate?.toISOString().split('T')[0]}
              onDateSelect={(date) => setSelectedDate(new Date(date))}
              showReservationForm={!!user}
              userRole={user?.profile?.tipoUsuario === 'administrador' ? 'admin' : 
                       user?.profile?.tipoUsuario === 'professor' ? 'professor' : 'student'}
            />
          </Card>
        </section>
        
        {/* Last Update */}
        {config.lastUpdate && (
          <div className="text-center text-xs text-uefs-gray-500 mb-4">
            Última atualização: {new Date(config.lastUpdate).toLocaleString('pt-BR')}
          </div>
        )}
      </main>
      
      <Footer />
      
      {/* User Status Indicator and Floating Buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2 z-50">
        {user && (
          <div className="bg-white rounded-lg shadow-lg p-3 flex items-center space-x-2 border border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-uefs-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-uefs-dark">{user.profile?.nome || user.displayName}</p>
                <p className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {user.profile?.tipoUsuario}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              size="sm"
              variant="outline"
              className="text-xs px-2 py-1 border-gray-300"
            >
              <LogIn className="w-3 h-3 mr-1" />
              Sair
            </Button>
          </div>
        )}
        
        {/* Admin Access Button */}
        <div className="relative">
          <Button
            onClick={handleAdminAccess}
            className="rounded-full w-12 h-12 shadow-lg bg-uefs-primary border-2 border-white"
            size="icon"
            title={user ? "Acessar Painel Admin" : "Login Admin"}
          >
            <Settings className="w-5 h-5 text-white" />
          </Button>
        </div>
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