import { useState } from 'react';
import { Settings, User, LogIn, Download } from 'lucide-react';
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
import { useDailySchedules } from '../hooks/useDailySchedules';
import { useRealTimeStatus } from '../hooks/useRealTimeStatus';
import { useNavigate } from 'react-router-dom';
import { exportDailySchedulesToExcel } from '../lib/excelExport';

export function PublicDashboard() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  
  const { user, logout } = useAuth();
  const { config, loading: dataLoading, error } = useLabData();
  const { dailySchedules, loading: schedulesLoading } = useDailySchedules();
  const currentStatus = useRealTimeStatus(config);
  const navigate = useNavigate();

  const isLoading = dataLoading || schedulesLoading;

  // Generate sample available dates for the calendar (next 30 days, excluding weekends)
  // This is now replaced by actual daily schedules from Firebase
  
  const handleExcelExport = () => {
    const result = exportDailySchedulesToExcel(dailySchedules);
    if (result.success) {
      alert(`Arquivo Excel exportado com sucesso: ${result.fileName}`);
    } else {
      alert(`Erro ao exportar Excel: ${result.error}`);
    }
  };

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
      <div className="relative overflow-hidden bg-gradient-to-r from-uefs-primary to-uefs-secondary py-12">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Laboratório de Computação
          </h1>
          <p className="text-xl text-uefs-gray-100 mb-6">
            Sistema de Gerenciamento - UEFS
          </p>
          <div className="flex justify-center items-center space-x-4">
            <div className="px-4 py-2 bg-white/20 rounded-full text-white font-medium">
              📍 Feira de Santana, BA
            </div>
            <div className="px-4 py-2 bg-white/20 rounded-full text-white font-medium">
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
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Calendar */}
          <div className="lg:col-span-1 transform transition-all duration-300 hover:scale-105">
            <ModernCalendar
              dailySchedules={dailySchedules}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>
          
          {/* Schedule Grid */}
          <div className="lg:col-span-2 transform transition-all duration-300 hover:scale-105">
            <ScheduleGrid 
              config={config} 
              selectedDate={selectedDate} 
              dailySchedules={dailySchedules}
            />
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-uefs-accent/10 to-uefs-accent/5 p-6 rounded-xl border border-uefs-accent/20 text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-uefs-accent mb-2">
              {Object.values(dailySchedules).filter(s => s.active).length}
            </div>
            <div className="text-uefs-gray-700 font-medium">Dias Funcionando</div>
          </div>
          <div className="bg-gradient-to-br from-uefs-primary/10 to-uefs-primary/5 p-6 rounded-xl border border-uefs-primary/20 text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-uefs-primary mb-2">
              {Object.keys(dailySchedules).length}
            </div>
            <div className="text-uefs-gray-700 font-medium">Dias Programados</div>
          </div>
          <div className="bg-gradient-to-br from-uefs-secondary/10 to-uefs-secondary/5 p-6 rounded-xl border border-uefs-secondary/20 text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-uefs-secondary mb-2">
              {new Date().toLocaleDateString('pt-BR', { month: 'long' })}
            </div>
            <div className="text-uefs-gray-700 font-medium">Mês Atual</div>
          </div>
        </div>
        
        {/* Export Button */}
        <div className="text-center mb-8">
          <div className="bg-white p-8 rounded-2xl shadow-uefs-lg border border-uefs-gray-200">
            <h3 className="text-2xl font-bold text-uefs-dark mb-4">
              📊 Exportar Dados
            </h3>
            <p className="text-uefs-gray-600 mb-6">
              Baixe o cronograma completo em formato Excel para consulta offline
            </p>
            <Button
              onClick={handleExcelExport}
              className="bg-gradient-to-r from-uefs-accent to-uefs-accent/90 hover:from-uefs-accent/90 hover:to-uefs-accent text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
              disabled={!dailySchedules || Object.keys(dailySchedules).length === 0}
            >
              <Download className="w-6 h-6 mr-3" />
              Exportar Cronograma em Excel
            </Button>
            <p className="text-sm text-uefs-gray-500 mt-4">
              ✨ Inclui todos os horários, observações e estatísticas
            </p>
          </div>
        </div>
        
        {/* Last Update */}
        <div className="text-center text-sm text-uefs-gray-500 mb-8">
          Última atualização: {new Date(config.lastUpdate).toLocaleString('pt-BR')}
        </div>
      </main>
      
      <Footer />
      
      {/* User Status Indicator and Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-3 z-50">
        {user && (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 flex items-center space-x-3 border border-uefs-gray-200 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-uefs-primary to-uefs-secondary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm">
                <p className="font-bold text-uefs-dark">{user.profile?.nome || user.displayName}</p>
                <p className="text-xs text-uefs-gray-600 capitalize bg-uefs-primary/10 px-2 py-1 rounded-full">
                  {user.profile?.tipoUsuario}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1 hover:bg-uefs-danger hover:text-white transition-colors"
            >
              <LogIn className="w-3 h-3" />
              <span>Sair</span>
            </Button>
          </div>
        )}
        
        {/* Admin Access Button */}
        <div className="relative group">
          <Button
            onClick={handleAdminAccess}
            className="rounded-full w-16 h-16 shadow-2xl bg-gradient-to-br from-uefs-primary to-uefs-secondary hover:from-uefs-secondary hover:to-uefs-primary transition-all duration-300 hover:scale-110 transform hover:shadow-3xl border-4 border-white"
            size="icon"
            title={user ? "Acessar Painel Admin" : "Login Admin"}
          >
            <Settings className="w-7 h-7" />
          </Button>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-uefs-dark text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              {user ? "Painel Admin" : "Login Admin"}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-uefs-dark"></div>
            </div>
          </div>
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