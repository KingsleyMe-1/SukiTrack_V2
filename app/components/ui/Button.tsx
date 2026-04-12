"use client";

function Buttons({ label, backgroundColor, icon }: { label: string, backgroundColor?: string, icon?: string }) {
  return (
    <button className={`ml-2 ${backgroundColor || 'bg-primary'} flex justify-center items-center text-primary-foreground text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer`}>
          {icon && <span className="material-symbols-outlined">{icon}</span>}
          {label}
    </button>
  )
}

export default Buttons