import { useState } from 'react';
import { Eye, EyeOff, LogIn, UserPlus, Computer, GraduationCap, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import type { LoginCredentials, RegisterCredentials, ValidationErrors } from '../../types/auth.types';

export function Login() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState<RegisterCredentials>({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    tipoUsuario: 'professor'
  });
  
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  
  const { login, register, resetPassword, loading } = useAuth();

  const validateLoginForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!loginData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(loginData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!loginData.password) {
      newErrors.password = 'Senha é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!registerData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (registerData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(registerData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!registerData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }
    
    if (!registerData.tipoUsuario) {
      newErrors.tipoUsuario = 'Tipo de usuário é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSuccessMessage('');
    
    if (!validateLoginForm()) return;
    
    const result = await login(loginData);
    if (!result.success) {
      setSubmitError(result.error || 'Erro ao fazer login');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSuccessMessage('');
    
    if (!validateRegisterForm()) return;
    
    const result = await register(registerData);
    if (result.success) {
      setSuccessMessage('Conta criada com sucesso! Bem-vindo ao sistema.');
      // Reset form
      setRegisterData({
        nome: '',
        email: '',
        password: '',
        confirmPassword: '',
        tipoUsuario: 'professor'
      });
    } else {
      setSubmitError(result.error || 'Erro ao criar conta');
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSuccessMessage('');
    
    if (!forgotPasswordEmail.trim()) {
      setSubmitError('Digite seu email para recuperar a senha');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
      setSubmitError('Email inválido');
      return;
    }
    
    const result = await resetPassword(forgotPasswordEmail);
    if (result.success) {
      setSuccessMessage('Email de recuperação enviado! Verifique sua caixa de entrada e pasta de spam.');
    } else {
      setSubmitError(result.error || 'Erro ao enviar email de recuperação');
    }
  };

  const clearMessages = () => {
    setSubmitError('');
    setSuccessMessage('');
    setErrors({});
  };

  const switchMode = (newMode: 'login' | 'register' | 'forgot-password') => {
    clearMessages();
    setMode(newMode);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <LoadingSpinner size="lg" text="Autenticando..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-4 mx-auto">
            <Computer className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Laboratório
          </h1>
          <p className="text-gray-600">
            Universidade Estadual de Feira de Santana - UEFS
          </p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="flex items-center justify-center space-x-2 text-xl">
              {mode === 'login' && <><LogIn className="w-5 h-5" /><span>Entrar</span></>}
              {mode === 'register' && <><UserPlus className="w-5 h-5" /><span>Criar Conta</span></>}
              {mode === 'forgot-password' && <><Shield className="w-5 h-5" /><span>Recuperar Senha</span></>}
            </CardTitle>
            <CardDescription>
              {mode === 'login' && 'Entre com suas credenciais para acessar o sistema'}
              {mode === 'register' && 'Preencha os dados para criar sua conta'}
              {mode === 'forgot-password' && 'Digite seu email para receber as instruções'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Success Message */}
            {successMessage && (
              <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 text-center">
                {submitError}
              </div>
            )}

            {/* Login Form */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => {
                      setLoginData(prev => ({ ...prev, email: e.target.value }));
                      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    placeholder="seu.email@exemplo.com"
                    disabled={loading}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => {
                        setLoginData(prev => ({ ...prev, password: e.target.value }));
                        if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                      }}
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
                  {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => switchMode('forgot-password')}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                    disabled={loading}
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                
                <Button
                  type="submit"
                  disabled={loading || !loginData.email || !loginData.password}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>

                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-3">
                    Não tem uma conta?
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => switchMode('register')}
                    disabled={loading}
                    className="w-full"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar Conta
                  </Button>
                </div>
              </form>
            )}

            {/* Register Form */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    type="text"
                    value={registerData.nome}
                    onChange={(e) => {
                      setRegisterData(prev => ({ ...prev, nome: e.target.value }));
                      if (errors.nome) setErrors(prev => ({ ...prev, nome: undefined }));
                    }}
                    placeholder="Seu nome completo"
                    disabled={loading}
                    className={errors.nome ? 'border-red-500' : ''}
                  />
                  {errors.nome && <p className="text-red-600 text-sm">{errors.nome}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">E-mail</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => {
                      setRegisterData(prev => ({ ...prev, email: e.target.value }));
                      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    placeholder="seu.email@exemplo.com"
                    disabled={loading}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoUsuario">Tipo de Usuário</Label>
                  <Select
                    id="tipoUsuario"
                    value={registerData.tipoUsuario}
                    onChange={(e) => {
                      setRegisterData(prev => ({ ...prev, tipoUsuario: e.target.value as 'professor' | 'administrador' }));
                      if (errors.tipoUsuario) setErrors(prev => ({ ...prev, tipoUsuario: undefined }));
                    }}
                    disabled={loading}
                    className={errors.tipoUsuario ? 'border-red-500' : ''}
                  >
                    <option value="professor">
                      <GraduationCap className="w-4 h-4 inline mr-2" />
                      Professor
                    </option>
                    <option value="administrador">
                      <Shield className="w-4 h-4 inline mr-2" />
                      Administrador
                    </option>
                  </Select>
                  {errors.tipoUsuario && <p className="text-red-600 text-sm">{errors.tipoUsuario}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => {
                        setRegisterData(prev => ({ ...prev, password: e.target.value }));
                        if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                      }}
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
                  {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerData.confirmPassword}
                      onChange={(e) => {
                        setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }));
                        if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                      }}
                      placeholder="••••••••"
                      disabled={loading}
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? 'Criando Conta...' : 'Criar Conta'}
                </Button>

                <div className="text-center pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => switchMode('login')}
                    disabled={loading}
                    className="w-full"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Voltar para Login
                  </Button>
                </div>
              </form>
            )}

            {/* Forgot Password Form */}
            {mode === 'forgot-password' && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
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

                <Button
                  type="submit"
                  disabled={loading || !forgotPasswordEmail.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? 'Enviando...' : 'Enviar Email de Recuperação'}
                </Button>

                <div className="text-center pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => switchMode('login')}
                    disabled={loading}
                    className="w-full"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Voltar para Login
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2024 Sistema de Gerenciamento do Laboratório UEFS</p>
        </div>
      </div>
    </div>
  );
}