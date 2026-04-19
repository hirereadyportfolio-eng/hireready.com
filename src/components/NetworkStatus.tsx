"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-red-500/10 border-b border-red-500/20 py-2 sticky top-0 z-[60]">
      <div className="hr-container flex items-center justify-center gap-3 text-red-200 text-sm">
        <WifiOff className="h-4 w-4 shrink-0" />
        <p>No internet connection. Reconnecting...</p>
      </div>
    </div>
  );
}
