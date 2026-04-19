"use client";

import { useAuth } from "@/context/AuthContext";
import { AlertCircle } from "lucide-react";

export function FirebaseConfigAlert() {
  const { isConfigured, authError } = useAuth();
  
  if (isConfigured && !authError) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 py-2">
      <div className="hr-container flex items-center gap-3 text-amber-200 text-sm">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <p>
          {!isConfigured 
            ? "Firebase is not fully configured. Authentication is currently disabled. Check your .env.local file."
            : authError}
        </p>
      </div>
    </div>
  );
}
