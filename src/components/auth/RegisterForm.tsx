import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select } from '../ui/select';
import type { RegisterCredentials, ValidationErrors } from '../../types/auth.types';

interface RegisterFormProps {
  onRegister: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  onBackToLogin: () => void;
  loading?: boolean;
}

export function RegisterForm({ onRegister, onBackToLogin, loading = false }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterCredentials>({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    tipoUsuario: 'aluno'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Nome validation
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    // User type validation
    if (!formData.tipoUsuario) {
      newErrors.tipoUsuario = 'Tipo de usuário é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegisterCredentials, value: string) => {
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

    const result = await onRegister(formData);
    if (!result.success) {
      setSubmitError(result.error || 'Erro ao criar conta');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="w-5 h-5" />
          <span>Criar Conta</span>
        </CardTitle>
        <CardDescription>
          Preencha os dados para criar sua conta no sistema
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Seu nome completo"
              disabled={loading}
              className={errors.nome ? 'border-red-500' : ''}
            />
            {errors.nome && (
              <p className="text-red-600 text-sm">{errors.nome}</p>
            )}
          </div>

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

          {/* Tipo de Usuário */}
          <div className="space-y-2">
            <Label htmlFor="tipoUsuario">Tipo de Usuário</Label>
            <Select
              id="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={(e) => handleInputChange('tipoUsuario', e.target.value as 'aluno' | 'administrador')}
              disabled={loading}
              className={errors.tipoUsuario ? 'border-red-500' : ''}
            >
              <option value="" disabled>Selecione o tipo de usuário</option>
              <option value="aluno">Aluno</option>
              <option value="administrador">Administrador</option>
            </Select>
            {errors.tipoUsuario && (
              <p className="text-red-600 text-sm">{errors.tipoUsuario}</p>
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

          {/* Confirmar Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
              {submitError}
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBackToLogin}
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Criando Conta...' : 'Criar Conta'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}