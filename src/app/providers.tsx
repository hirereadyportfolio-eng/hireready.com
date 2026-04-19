"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import type { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111",
              color: "#fff",
              border: "1px solid #333",
            },
          }}
        />
      </MotionConfig>
    </AuthProvider>
  );
}

export function PageTransition({ children }: PropsWithChildren) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

