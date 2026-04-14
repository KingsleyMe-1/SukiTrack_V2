import Link from "next/link";

const journeyCards = [
  {
    icon: "person",
    title: "I'm a Customer",
    description:
      "Track your weekly spending across multiple stores, compare neighborhood prices in real-time, and manage your 'listahan' digitally with zero friction.",
    cta: "Get Started",
    dark: false,
    link: "/customer",
  },
  {
    icon: "store",
    title: "I'm a Store Owner",
    description:
      "Digitize your inventory, notify regulars of new stock arrivals, and maintain professional digital ledgers for customer tabs with ease.",
    cta: "Register Store",
    dark: true,
    link: "/dashboard",
  },
] as const;

export function JourneySection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-10">
        <div className="text-center max-w-xl mx-auto mb-14 md:mb-18 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 tracking-tight">
            Choose your journey
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
            Whether you&apos;re looking for your favorite local store or managing your own business, we have the right tools for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">
          {journeyCards.map((card) => (
            <Link
              key={card.title}
              href={card.link}
              className={`p-10 md:p-12 rounded-[3rem] transition-all group cursor-pointer flex flex-col items-start ${
                card.dark
                  ? "bg-emphasis-surface border border-emphasis-accent/10 shadow-2xl shadow-black/20 hover:border-emphasis-accent/25 hover:shadow-primary/15"
                  : "bg-card shadow-sm hover:shadow-2xl hover:shadow-primary/5 border border-border hover:border-primary/30"
              }`}
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-8 md:mb-10 shadow-sm group-hover:scale-110 transition-all duration-500 ${
                  card.dark
                    ? "bg-emphasis-accent/10 text-emphasis-accent group-hover:bg-emphasis-accent/15"
                    : "bg-secondary text-primary group-hover:bg-primary/8"
                }`}
              >
                <span className="material-symbols-outlined text-2xl md:text-3xl font-light">{card.icon}</span>
              </div>
              <h3
                className={`text-xl md:text-2xl font-extrabold mb-3 md:mb-4 tracking-tight ${
                  card.dark ? "text-emphasis-on-surface" : "text-on-surface"
                }`}
              >
                {card.title}
              </h3>
              <p
                className={`mb-8 md:mb-10 leading-relaxed text-sm md:text-base font-medium opacity-80 ${
                  card.dark ? "text-emphasis-on-surface" : "text-muted-foreground"
                }`}
              >
                {card.description}
              </p>
              <div
                className={`flex items-center font-bold gap-3 text-sm md:text-base mt-auto group-hover:gap-5 transition-all ${
                  card.dark ? "text-emphasis-accent" : "text-primary"
                }`}
              >
                {card.cta}
                <span className="material-symbols-outlined font-bold">arrow_forward</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
