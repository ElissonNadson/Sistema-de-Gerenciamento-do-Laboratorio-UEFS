import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Login } from '../components/Auth/Login';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: 'administrador' | 'professor';
}

// Private routes - require authentication and optionally specific roles
export function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uefs-gray-50 to-uefs-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-uefs-primary mx-auto mb-4"></div>
          <p className="text-uefs-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (requiredRole && user.profile?.tipoUsuario !== requiredRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uefs-gray-50 to-uefs-primary/5 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-uefs-danger text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-uefs-dark mb-2">Acesso Negado</h1>
          <p className="text-uefs-gray-600 mb-4">
            Você não tem permissão para acessar esta área. Apenas {requiredRole}s podem acessar.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}