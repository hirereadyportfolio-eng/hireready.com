"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  AuthError
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "user" | "admin";
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isConfigured: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Robust profile fetching with auto-creation
          const userDocRef = doc(db, "users", firebaseUser.uid);
          let role: "user" | "admin" = "user";
          let userDoc;

          try {
            userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              role = userDoc.data().role || "user";
            } else {
              // Silently create missing profile
              const newProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                role: "user",
                createdAt: new Date().toISOString()
              };
              await setDoc(userDocRef, newProfile);
              console.log("Auto-created missing user profile");
            }
          } catch (docError: any) {
            console.warn("Firestore fetch error (likely offline or rules):", docError);
            // If we can't fetch, we still set the basic user info from Auth
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Critical error in auth state change:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);


  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      setAuthError("Firebase Authentication is not configured yet. Check Firebase Console.");
      return;
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      await signInWithPopup(auth, provider);
      setAuthError(null);
    } catch (error) {
      const err = error as AuthError;
      console.error("Error signing in with Google", err);
      
      if (err.code === "auth/configuration-not-found") {
        setAuthError("Google Sign-In is not enabled in Firebase Console.");
      } else if (err.code === "auth/popup-blocked") {
        setAuthError("Sign-in popup was blocked by your browser.");
      } else if (err.code === "auth/unauthorized-domain") {
        setAuthError("This domain is not authorized for Google Sign-In.");
      } else {
        setAuthError(err.message || "An error occurred during sign in.");
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (auth) {
        await firebaseSignOut(auth);
      }
      setUser(null);
    } catch (error) {
      console.error("Error signing out", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) return;
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending password reset email", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isConfigured: isFirebaseConfigured, 
      authError,
      signInWithGoogle, 
      logout, 
      resetPassword 
    }}>
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

