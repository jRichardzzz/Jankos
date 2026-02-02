"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthContext";

interface CreditsContextType {
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  deductCredits: (amount: number) => Promise<boolean>;
  addCredits: (amount: number) => Promise<boolean>;
  refreshCredits: () => Promise<void>;
  isHydrated: boolean;
  isLoading: boolean;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ 
  children, 
  initialCredits = 0 
}: { 
  children: React.ReactNode;
  initialCredits?: number;
}) {
  const [credits, setCredits] = useState(initialCredits);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  // Fetch credits from Supabase
  const fetchCredits = useCallback(async () => {
    if (!user) {
      setCredits(0);
      setIsLoading(false);
      setIsHydrated(true);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching credits:', error);
        // Si le profil n'existe pas encore, on le crée
        if (error.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name,
              avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
              credits: 0
            });
          
          if (!insertError) {
            setCredits(0);
          }
        }
      } else if (data) {
        setCredits(data.credits);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
      setIsHydrated(true);
    }
  }, [user, supabase]);

  // Load credits when user changes
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Refresh credits from database
  const refreshCredits = useCallback(async () => {
    await fetchCredits();
  }, [fetchCredits]);

  // Deduct credits - returns true if successful, false if insufficient
  const deductCredits = useCallback(async (amount: number): Promise<boolean> => {
    if (!user) return false;
    if (credits < amount) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          credits: credits - amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error deducting credits:', error);
        return false;
      }

      setCredits(prev => prev - amount);
      return true;
    } catch (err) {
      console.error('Error:', err);
      return false;
    }
  }, [user, credits, supabase]);

  // Add credits (for purchases)
  const addCredits = useCallback(async (amount: number): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          credits: credits + amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error adding credits:', error);
        return false;
      }

      setCredits(prev => prev + amount);
      return true;
    } catch (err) {
      console.error('Error:', err);
      return false;
    }
  }, [user, credits, supabase]);

  return (
    <CreditsContext.Provider value={{ 
      credits, 
      setCredits, 
      deductCredits, 
      addCredits, 
      refreshCredits,
      isHydrated,
      isLoading 
    }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return context;
}
