"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "outline" | "secondary" | "accent" | "success" | "warning" | "danger";
}

export function Badge({ className, variant = "secondary", ...props }: BadgeProps) {
  const variants = {
    outline: "border-white/10 text-white/70",
    secondary: "bg-white/5 border-white/10 text-white/80",
    accent: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    success: "bg-green-500/10 border-green-500/20 text-green-400",
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    danger: "bg-red-500/10 border-red-500/20 text-red-500",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
