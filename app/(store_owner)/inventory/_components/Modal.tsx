import { useEffect } from 'react'


export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-background/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 transition-opacity"
      />
      <div
        className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2
            className="font-display font-bold text-base"
            style={{ color: "var(--foreground)" }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto scrollbar-none">
          {children}
        </div>
      </div>
    </div>
  );
}

