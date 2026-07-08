"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";

export type UserRole = "receptionist" | "medical_officer" | null;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  signInAsReceptionist: () => Promise<void>;
  signInAsMedicalOfficer: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasAccess: (path: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<UserRole>("medical_officer");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let id = localStorage.getItem('phc_sandbox_id');
    if (!id) {
      id = `sb-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('phc_sandbox_id', id);
    }
    const resolvedId = id;
    Promise.resolve().then(() => {
      setUser({ uid: resolvedId, email: "mo@phc.gov.in", isAnonymous: true });
      setLoading(false);
    });
  }, []);

  // Route permission config - bypassed as auth is disabled
  const hasAccess = useCallback((path: string): boolean => {
    return true;
  }, []);


  const signInAsReceptionist = async () => {
    setLoading(true);
    try {
      await signInAnonymously(auth);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInAsMedicalOfficer = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setRole(null);
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        role, 
        loading, 
        signInAsReceptionist, 
        signInAsMedicalOfficer, 
        signOut,
        hasAccess
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
