export interface UserProfile {
  uid: string;
  email: string;
  nome: string;
  tipoUsuario: 'professor' | 'administrador';
  criadoEm: Date;
  ativo: boolean;
  photoURL?: string;
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  profile?: UserProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  nome: string;
  email: string;
  password: string;
  confirmPassword: string;
  tipoUsuario: 'professor' | 'administrador';
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: AuthUser;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (credentials: RegisterCredentials) => Promise<AuthResult>;
  logout: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updateProfile: (data: Partial<UserProfile>) => Promise<AuthResult>;
}

export interface ValidationErrors {
  nome?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  tipoUsuario?: string;
}