import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScheduleGrid } from './components/dashboard/ScheduleGrid';
import { StatusIndicator } from './components/dashboard/StatusIndicator';
import { AlertBanner } from './components/dashboard/AlertBanner';
import { AdminPanel } from './components/admin/AdminPanel';
import { LoginModal } from './components/admin/LoginModal';
import { Button } from './components/ui/button';
import { useAuth } from './hooks/useAuth';
import { useLabData } from './hooks/useLabData';
import { useRealTimeStatus } from './hooks/useRealTimeStatus';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  const { user, loading: authLoading, login, logout } = useAuth();
  const { config, loading: dataLoading, error, updateConfig } = useLabData();
  const currentStatus = useRealTimeStatus(config);

  const isLoading = authLoading || dataLoading;

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      setShowAdminPanel(true);
    }
    return result;
  };

  const handleLogout = async () => {
    await logout();
    setShowAdminPanel(false);
  };

  const handleAdminAccess = () => {
    if (user) {
      setShowAdminPanel(true);
    } else {
      setShowLoginModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro de Conexão</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (showAdminPanel && user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentStatus={currentStatus} />
        <main className="container mx-auto px-4 py-8">
          <AdminPanel
            user={user}
            config={config}
            onLogout={handleLogout}
            onUpdateConfig={updateConfig}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
        
        {/* Schedule Grid */}
        <div className="mb-8">
          <ScheduleGrid config={config} />
        </div>
        
        {/* Last Update */}
        <div className="text-center text-sm text-gray-500 mb-8">
          Última atualização: {new Date(config.lastUpdate).toLocaleString('pt-BR')}
        </div>
      </main>
      
      <Footer />
      
      {/* Floating Admin Button */}
      <Button
        onClick={handleAdminAccess}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
        size="icon"
      >
        <Settings className="w-6 h-6" />
      </Button>
      
      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        loading={authLoading}
      />
    </div>
  );
}

export default App;
