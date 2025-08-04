import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { AdminPanel } from '../components/admin/AdminPanel';
import { useAuth } from '../hooks/useAuth';
import { useLabData } from '../hooks/useLabData';
import { useRealTimeStatus } from '../hooks/useRealTimeStatus';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const { config, updateConfig } = useLabData();
  const currentStatus = useRealTimeStatus(config);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/');
    }
  };

  // This component is wrapped in PrivateRoute with admin requirement,
  // so user should always be available here
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-uefs-gray-50 to-uefs-primary/5">
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