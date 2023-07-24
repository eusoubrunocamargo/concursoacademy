import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../supabase';
import { useAlert } from './useAlert';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const { showAlert } = useAlert();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
    
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showAlert('Não foi possível fazer logout!', 'fail');
    }
    router.push('/');
  };

  const handleLogin = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if(error){
        showAlert('Não foi possível fazer login!', 'fail');
    }
    router.push('/dashboard');
  };
    
  useEffect(() => {
    const checkAuth = async () => {
      setLoadingAuth(true);
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        showAlert('Não foi possível autenticar o usuário!', 'fail');
      }

      if (!session && router.pathname !== '/') {
          router.push('/');
        } else {
          setUser(session?.user);
        }

      setLoadingAuth(false);

    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();

  }, [router]);

  const value = useMemo(() => ({ user, handleSignOut, handleLogin, loadingAuth }), [user, handleSignOut, handleLogin, loadingAuth]);

  return (
    <AuthContext.Provider value={value}>
        {!loadingAuth && children }
    </AuthContext.Provider>
    // <AuthContext.Provider value={{ 
    //   user, 
    //   handleSignOut, 
    //   handleLogin,
    //   loadingAuth,
    //   }}>
    //     {!loadingAuth && children }
    // </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
