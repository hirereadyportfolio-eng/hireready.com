import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center" | "right";
}) {
  return (
    <div className={cn(
      "max-w-2xl", 
      align === "center" && "mx-auto text-center",
      align === "right" && "ml-auto text-right",
      className
    )}>
      {eyebrow ? (
        <div className={cn(
          "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-white/80",
          align === "center" && "mx-auto"
        )}>
          {eyebrow}
        </div>
      ) : null}
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)] sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

