import { cn } from "@/app/utils/cn";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-surface-container/75 backdrop-blur-xl border border-on-surface/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
