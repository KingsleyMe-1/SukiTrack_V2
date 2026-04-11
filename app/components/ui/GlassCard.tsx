import { cn } from "@/app/utils/cn";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-card/80 backdrop-blur-xl border border-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
