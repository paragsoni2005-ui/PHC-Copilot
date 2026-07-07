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
  const [user, setUser] = useState<any>({ uid: "demo-user", email: "mo@phc.gov.in", isAnonymous: false });
  const [role, setRole] = useState<UserRole>("medical_officer");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Route permission config - bypassed as auth is disabled
  const hasAccess = useCallback((path: string): boolean => {
    return true;
  }, []);

  // Sync auth state - bypassed to keep authentication disabled
  useEffect(() => {
    setUser({ uid: "demo-user", email: "mo@phc.gov.in", isAnonymous: false } as any);
    setRole("medical_officer");
    setLoading(false);
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
