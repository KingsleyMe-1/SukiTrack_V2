interface GreetingBannerProps {
  userName: string;
  alertCount: number;
}

export function GreetingBanner({ userName, alertCount }: GreetingBannerProps) {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(now);

  return (
    <div className="px-6 md:px-10 pb-2">
      <div className="w-full bg-surface-bright border-l-[6px] border-primary-fixed rounded-lg p-8 md:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-on-surface">
            {greeting}, {userName}.
          </h2>
          <p className="text-on-surface-variant font-medium mt-1 text-sm md:text-base">
            {alertCount > 0
              ? `Your store has ${alertCount} low-stock alert${alertCount !== 1 ? "s" : ""} today.`
              : "All stock levels are healthy today."}
          </p>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">
            Current Date
          </p>
          <p className="text-lg md:text-2xl font-bold text-on-surface tracking-tight">
            {formattedDate}
          </p>
        </div>
      </div>
    </div>
  );
}
