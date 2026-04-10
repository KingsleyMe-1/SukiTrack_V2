import { GlassCard } from "@/app/components/ui/GlassCard";
import { cn } from "@/app/utils/cn";
import { formatPHP } from "@/app/utils/format";
import { ActivityItem } from "@/app/types/dashboard";

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const typeConfig = {
  order: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    icon: "shopping_basket",
    amountColor: "text-primary",
  },
  credit: {
    iconBg: "bg-tertiary/10",
    iconColor: "text-tertiary",
    icon: "history_edu",
    amountColor: "text-tertiary",
  },
  registration: {
    iconBg: "bg-surface-container-high",
    iconColor: "text-on-surface-variant",
    icon: "person_add",
    amountColor: "text-on-surface",
  },
} as const;

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <section className="space-y-4 md:space-y-6">
      {/* Section header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-extrabold tracking-tight text-on-surface">
          Real-time Stream
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
            Live Updates
          </span>
          <span
            className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Activity items */}
      <div className="grid grid-cols-1 gap-3">
        {activities.map((activity) => {
          const config = typeConfig[activity.type];
          return (
            <GlassCard
              key={activity.id}
              className="glass-panel rounded-2xl p-4 md:p-5 hover:bg-surface-container-lowest hover:shadow-premium transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Left — icon + text */}
              <div className="flex items-center space-x-4 md:space-x-5 min-w-0">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                    config.iconBg
                  )}
                >
                  <span
                    className={cn(
                      "material-symbols-outlined text-2xl",
                      config.iconColor
                    )}
                  >
                    {config.icon}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center flex-wrap gap-1.5">
                    <p className="font-bold text-on-surface">{activity.title}</p>
                    {activity.isNew && (
                      <span className="px-2 py-0.5 bg-secondary-container text-primary text-[9px] font-black uppercase rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                    {activity.subtitle}
                  </p>
                </div>
              </div>

              {/* Right — amount or action buttons */}
              {activity.requiresAction ? (
                <div className="flex items-center space-x-3 shrink-0 md:ml-auto">
                  <button className="text-[10px] font-bold text-on-surface-variant px-4 py-2 hover:bg-surface-container rounded-xl transition-colors uppercase tracking-widest">
                    Reject
                  </button>
                  <button className="bg-primary text-on-primary text-[10px] font-bold px-5 py-2 rounded-xl shadow-lg shadow-primary/10 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
                    Approve
                  </button>
                </div>
              ) : activity.amount !== undefined ? (
                <div className="text-left md:text-right shrink-0 md:ml-auto">
                  <p className={cn("text-lg font-black", config.amountColor)}>
                    {formatPHP(activity.amount)}
                  </p>
                  {activity.amountLabel && (
                    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                      {activity.amountLabel}
                    </p>
                  )}
                </div>
              ) : null}
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
