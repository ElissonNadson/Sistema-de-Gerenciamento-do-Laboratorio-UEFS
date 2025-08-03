import { useState } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, onSuccess, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const { login, register, resetPassword, loading } = useAuth();

  const handleClose = () => {
    setMode('login'); // Reset to login mode when closing
    onClose();
  };

  const handleLoginSuccess = () => {
    onSuccess?.();
    handleClose();
  };

  const handleRegisterSuccess = () => {
    onSuccess?.();
    handleClose();
  };

  const handleLogin = async (credentials: { email: string; password: string }) => {
    const result = await login(credentials);
    if (result.success) {
      handleLoginSuccess();
    }
    return result;
  };

  const handleRegister = async (credentials: {
    nome: string;
    email: string;
    password: string;
    confirmPassword: string;
    tipoUsuario: 'professor' | 'administrador';
  }) => {
    const result = await register(credentials);
    if (result.success) {
      handleRegisterSuccess();
    }
    return result;
  };

  const handleForgotPassword = async (email: string) => {
    return await resetPassword(email);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-md w-full">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          disabled={loading}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Auth Form */}
        {mode === 'login' ? (
          <LoginForm
            onLogin={handleLogin}
            onRegister={() => setMode('register')}
            onForgotPassword={handleForgotPassword}
            loading={loading}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onBackToLogin={() => setMode('login')}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}