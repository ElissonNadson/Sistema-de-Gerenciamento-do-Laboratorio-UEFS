import { useState } from 'react';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { LoginCredentials, ValidationErrors } from '../../types/auth.types';

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  onRegister: () => void;
  onForgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
}

export function LoginForm({ onLogin, onRegister, onForgotPassword, loading = false }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    const result = await onLogin(formData);
    if (!result.success) {
      setSubmitError(result.error || 'Erro ao fazer login');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail.trim()) {
      setSubmitError('Digite seu email para recuperar a senha');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
      setSubmitError('Email inválido');
      return;
    }

    setSubmitError('');
    const result = await onForgotPassword(forgotPasswordEmail);
    
    if (result.success) {
      setForgotPasswordSuccess(true);
    } else {
      setSubmitError(result.error || 'Erro ao enviar email de recuperação');
    }
  };

  const resetForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    setForgotPasswordSuccess(false);
    setSubmitError('');
  };

  if (showForgotPassword) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Recuperar Senha</CardTitle>
          <CardDescription>
            {forgotPasswordSuccess 
              ? 'Email de recuperação enviado!' 
              : 'Digite seu email para receber as instruções de recuperação'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {forgotPasswordSuccess ? (
            <div className="space-y-4">
              <div className="text-green-600 text-sm bg-green-50 p-3 rounded border border-green-200">
                Enviamos um email com instruções para recuperar sua senha. 
                Verifique sua caixa de entrada e pasta de spam.
              </div>
              <Button
                type="button"
                onClick={resetForgotPassword}
                className="w-full"
              >
                Voltar para Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgotEmail">E-mail</Label>
                <Input
                  id="forgotEmail"
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  disabled={loading}
                />
              </div>

              {submitError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
                  {submitError}
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForgotPassword}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !forgotPasswordEmail.trim()}
                  className="flex-1"
                >
                  {loading ? 'Enviando...' : 'Enviar Email'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <LogIn className="w-5 h-5" />
          <span>Acesso ao Sistema</span>
        </CardTitle>
        <CardDescription>
          Entre com suas credenciais para acessar o sistema
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="seu.email@exemplo.com"
              disabled={loading}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}
          </div>
          
          {/* Senha */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className={errors.password ? 'border-red-500' : ''}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
              disabled={loading}
            >
              Esqueceu a senha?
            </button>
          </div>
          
          {/* Submit Error */}
          {submitError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
              {submitError}
            </div>
          )}
          
          {/* Login Button */}
          <Button
            type="submit"
            disabled={loading || !formData.email || !formData.password}
            className="w-full"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          {/* Register Link */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600 mb-3">
              Não tem uma conta?
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={onRegister}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Criar Conta</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}