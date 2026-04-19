import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  glass = true,
}: {
  className?: string;
  children: React.ReactNode;
  glass?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/10 transition-all duration-300",
        glass ? "bg-white/[0.03] backdrop-blur-xl" : "bg-white/[0.02]",
        className
      )}
    >
      <div className="absolute -inset-10 bg-gradient-to-tr from-white/[0.02] via-transparent to-transparent opacity-50 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
