export function InputField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground mb-1 sm:mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
