import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import type { User } from '../types/lab';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || ''
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true, error: null };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true, error: null };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  };

  return { user, loading, login, logout };
}