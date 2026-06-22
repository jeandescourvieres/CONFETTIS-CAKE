import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@services/supabase';
import type { Profile } from '../types/models';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signUpWithPassword: (email: string, password: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const { data } = await supabase.auth.getSession();
      set({
        session: data.session,
        user: data.session?.user ?? null,
      });
      if (data.session) {
        // Ne bloque pas le démarrage : le profil arrive en arrière-plan une fois l'app affichée
        get().fetchProfile().catch(() => {});
      }
      // Écoute les changements de session
      supabase.auth.onAuthStateChange(async (_event, session) => {
        set({ session, user: session?.user ?? null });
        if (session) {
          await get().fetchProfile();
        } else {
          set({ profile: null });
        }
      });
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  signInWithEmail: async (email: string) => {
    set({ isLoading: true });
    try {
      const redirectTo = Linking.createURL('auth/callback');
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signUpWithPassword: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.session) {
        set({ session: data.session, user: data.session.user });
        await get().fetchProfile();
      }
    } finally {
      set({ isLoading: false });
    }
  },

  signInWithPassword: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.session) {
        set({ session: data.session, user: data.session.user });
        await get().fetchProfile();
      }
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (email: string) => {
    const redirectTo = Linking.createURL('reset-password');
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
  },

  signInWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const redirectTo = Linking.createURL('auth/callback');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error) throw error;
      if (data.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
        if (result.type === 'success' && result.url) {
          const url = result.url;
          const hashIndex = url.indexOf('#');
          if (hashIndex !== -1) {
            const hash = url.substring(hashIndex + 1);
            const params = Object.fromEntries(new URLSearchParams(hash));
            if (params['access_token'] && params['refresh_token']) {
              await supabase.auth.setSession({
                access_token: params['access_token'],
                refresh_token: params['refresh_token'],
              });
            }
          }
        }
      }
    } finally {
      set({ isLoading: false });
    }
  },

  signInWithApple: async () => {
    set({ isLoading: true });
    try {
      const redirectTo = Linking.createURL('auth/callback');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: { redirectTo },
      });
      if (error) throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null });
  },

  fetchProfile: async () => {
    const user = get().user;
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (data) set({ profile: data as Profile });
  },

  updateProfile: async (data) => {
    const user = get().user;
    if (!user) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updated, error } = await (supabase.from('profiles') as any)
      .update(data)
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw error;
    if (updated) set({ profile: updated as Profile });
  },
}));
