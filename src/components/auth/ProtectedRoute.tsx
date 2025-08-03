import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FullScreenLoadingSpinner } from '../Common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'professor' | 'administrador';
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, requiredRole, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return <FullScreenLoadingSpinner text="Verificando autenticação..." />;
  }

  // If user is not authenticated, show fallback or redirect message
  if (!user) {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-br from-uefs-gray-50 to-uefs-primary/5 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-uefs-primary text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-uefs-dark mb-2">Acesso Restrito</h1>
            <p className="text-uefs-gray-600 mb-4">
              Você precisa estar logado para acessar esta página.
            </p>
          </div>
        </div>
      )
    );
  }

  // If a specific role is required, check if user has it
  if (requiredRole && user.profile?.tipoUsuario !== requiredRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uefs-gray-50 to-uefs-primary/5 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-uefs-danger text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-uefs-dark mb-2">Acesso Negado</h1>
          <p className="text-uefs-gray-600 mb-4">
            Você não tem permissão para acessar esta área do sistema.
          </p>
          <p className="text-sm text-uefs-gray-500">
            Área restrita para: {requiredRole === 'administrador' ? 'Administradores' : 'Professores'}
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and has the required role (if any)
  return <>{children}</>;
}