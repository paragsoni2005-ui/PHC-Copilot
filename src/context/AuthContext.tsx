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
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Route permission config
  const hasAccess = useCallback((path: string): boolean => {
    if (!role) return path === "/"; // Guests can only access landing page
    if (role === "receptionist") {
      return path === "/opd-registration"; // Receptionist can only access OPD intake
    }
    if (role === "medical_officer") {
      // MO can access all internal routes except registration
      return path !== "/opd-registration";
    }
    return false;
  }, [role]);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Fetch role from Firestore user profile
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setRole(userDoc.data().role as UserRole);
          } else {
            // Auto-provision role if profile doc doesn't exist
            let assignedRole: UserRole = "receptionist";
            let displayName = "Staff";

            if (firebaseUser.isAnonymous) {
              assignedRole = "receptionist";
              displayName = "OPD Receptionist";
            } else if (firebaseUser.email) {
              assignedRole = "medical_officer";
              displayName = firebaseUser.email.split("@")[0].toUpperCase() === "MO" 
                ? "Dr. Sarah" 
                : "Medical Officer";
            }

            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "anonymous",
              displayName,
              role: assignedRole,
              createdAt: new Date().toISOString()
            });
            setRole(assignedRole);
          }
        } catch (error) {
          console.error("Error fetching user profile role:", error);
          // Local fallback in case of Firestore rules/connection issues
          setRole(firebaseUser.isAnonymous ? "receptionist" : "medical_officer");
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
