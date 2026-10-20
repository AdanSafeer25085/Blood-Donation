import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { fetchProfile, mapProfile, logout as doLogout } from '../services/auth.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load the profile for a Supabase session and expose it as `user`.
  const loadUserFromSession = async (session) => {
    if (!session?.user) {
      setUser(null);
      return;
    }
    try {
      const profile = await fetchProfile(session.user.id);
      setUser(mapProfile(profile, session.user));
    } catch (error) {
      console.error('Error loading profile:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    let active = true;

    // Initial session on page load.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return;
      await loadUserFromSession(session);
      setLoading(false);
    });

    // React to sign-in / sign-out / token refresh.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUserFromSession(session);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  // Called by login screens after a successful sign-in. The auth listener
  // also fires, but setting it here avoids a flash.
  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await doLogout();
    setUser(null);
  };

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
