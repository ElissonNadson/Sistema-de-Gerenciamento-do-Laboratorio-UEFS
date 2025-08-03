import { useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { AuthContext } from './AuthContext';
import type {
  AuthContextType,
  AuthUser,
  UserProfile,
  LoginCredentials,
  RegisterCredentials,
  AuthResult
} from '../types/auth.types';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const userProfile = await fetchUserProfile(firebaseUser);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          profile: userProfile
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const fetchUserProfile = async (firebaseUser: FirebaseUser): Promise<UserProfile | undefined> => {
    try {
      const userDocRef = doc(db, 'usuarios', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          nome: data.nome,
          tipoUsuario: data.tipoUsuario,
          criadoEm: data.criadoEm?.toDate(),
          ativo: data.ativo,
          photoURL: data.photoURL
        };
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    return undefined;
  };

  const createUserProfile = async (firebaseUser: FirebaseUser, nome: string, tipoUsuario: 'professor' | 'administrador'): Promise<UserProfile> => {
    const userProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      nome,
      tipoUsuario,
      criadoEm: new Date(),
      ativo: true
    };

    try {
      const userDocRef = doc(db, 'usuarios', firebaseUser.uid);
      await setDoc(userDocRef, {
        ...userProfile,
        criadoEm: new Date() // Firestore timestamp
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }

    return userProfile;
  };

  const login = async ({ email, password }: LoginCredentials): Promise<AuthResult> => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await fetchUserProfile(result.user);
      
      const authUser: AuthUser = {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || '',
        profile: userProfile
      };

      return { success: true, user: authUser };
    } catch (error: unknown) {
      let errorMessage = 'Erro ao fazer login';
      
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message?: string };
        switch (firebaseError.code) {
          case 'auth/user-not-found':
            errorMessage = 'Usuário não encontrado';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Senha incorreta';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Email inválido';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Usuário desabilitado';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
            break;
          default:
            errorMessage = firebaseError.message || 'Erro desconhecido';
        }
      }

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ nome, email, password, tipoUsuario }: RegisterCredentials): Promise<AuthResult> => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase Auth profile
      await updateFirebaseProfile(result.user, {
        displayName: nome
      });

      // Create user profile in Firestore
      const userProfile = await createUserProfile(result.user, nome, tipoUsuario);
      
      const authUser: AuthUser = {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: nome,
        photoURL: result.user.photoURL || '',
        profile: userProfile
      };

      return { success: true, user: authUser };
    } catch (error: unknown) {
      let errorMessage = 'Erro ao criar conta';
      
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message?: string };
        switch (firebaseError.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Este email já está em uso';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Email inválido';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Operação não permitida';
            break;
          case 'auth/weak-password':
            errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres';
            break;
          default:
            errorMessage = firebaseError.message || 'Erro desconhecido';
        }
      }

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<AuthResult> => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer logout';
      return { success: false, error: errorMessage };
    }
  };

  const resetPassword = async (email: string): Promise<AuthResult> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: unknown) {
      let errorMessage = 'Erro ao enviar email de recuperação';
      
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message?: string };
        switch (firebaseError.code) {
          case 'auth/user-not-found':
            errorMessage = 'Usuário não encontrado';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Email inválido';
            break;
          default:
            errorMessage = firebaseError.message || 'Erro desconhecido';
        }
      }

      return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<AuthResult> => {
    if (!user?.uid) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      const userDocRef = doc(db, 'usuarios', user.uid);
      await updateDoc(userDocRef, data);
      
      // Update local state
      if (user.profile) {
        setUser({
          ...user,
          profile: { ...user.profile, ...data }
        });
      }

      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
      return { success: false, error: errorMessage };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}