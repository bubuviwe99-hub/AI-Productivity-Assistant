import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkle, CalendarCheck, MessageCircle, Wand2 } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { categories, categoryImages, services, salon } from "@/data/salon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Élan | Luxury Beauty Atelier in Cape Town" },
      {
        name: "description",
        content:
          "Makeup, lashes, massages, hair extensions and nails at Maison Élan — a luxury Cape Town beauty atelier with AI-assisted booking and concierge.",
      },
      { property: "og:title", content: "Maison Élan | Luxury Beauty Atelier" },
      {
        property: "og:description",
        content:
          "Elegant beauty treatments and an intelligent concierge that helps you choose, prepare and book.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const aiFeatures = [
  {
    to: "/assistant" as const,
    icon: MessageCircle,
    title: "AI Beauty Concierge",
    copy: "Describe your occasion and get service suggestions, timings and prep notes in seconds.",
  },
  {
    to: "/planner" as const,
    icon: CalendarCheck,
    title: "AI Task Planner",
    copy: "Turn a sentence into a prioritised studio schedule with conflict detection for the team.",
  },
  {
    to: "/email-generator" as const,
    icon: Wand2,
    title: "Smart Email Studio",
    copy: "Draft reminders, confirmations and promotions in your house tone — reviewed before sending.",
  },
];

function Home() {
  const featured = services.slice(0, 3);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden surface-veil">
        <span className="orb -left-24 top-10 h-80 w-80 bg-blush" aria-hidden />
        <span className="orb -right-16 bottom-0 h-96 w-96 bg-sage" aria-hidden />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.05fr_1fr] lg:px-10 lg:py-28">
          <div>
            <p className="eyebrow animate-rise">{salon.name} · Cape Town</p>
            <h1 className="animate-rise mt-5 text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
              Beauty, composed
              <span className="block italic text-gold-gradient">with intention.</span>
            </h1>
            <p className="animate-rise mt-7 max-w-xl text-base leading-relaxed text-muted-foreground">
              Makeup, lashes, massages, hair extensions and nails — delivered in a calm ivory
              atelier, and supported by an AI concierge that helps you choose, prepare and book.
            </p>
            <div className="animate-rise mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
              >
                Book an appointment <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/assistant"
                className="gold-rule inline-flex items-center gap-2 rounded-full bg-card px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60"
              >
                <Sparkle className="h-4 w-4 text-gold" /> Ask the concierge
              </Link>
            </div>
            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                ["12", "Years of artistry"],
                ["5", "Signature disciplines"],
                ["4.9", "Average client rating"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-serif text-3xl text-foreground">{value}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <span className="absolute -top-8 -left-8 h-40 w-40 rounded-full border border-gold/50" aria-hidden />
            <span className="absolute -bottom-10 -right-6 h-28 w-28 rounded-full bg-mauve/60" aria-hidden />
            <img
              src={heroImg}
              alt="Client with luminous signature makeup at Maison Élan"
              width={1408}
              height={1760}
              className="relative w-full rounded-[999px_999px_28px_28px] object-cover shadow-lift"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-24 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The menu</p>
            <h2 className="mt-3 text-4xl text-foreground sm:text-5xl">Five disciplines, one standard</h2>
          </div>
          <Link to="/services" className="text-sm text-foreground underline underline-offset-8 decoration-gold/60">
            View all services
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c, i) => (
            <Link
              key={c}
              to="/services"
              search={{ category: c }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-transform hover:-translate-y-1"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <img
                src={categoryImages[c]}
                alt={c}
                loading="lazy"
                width={900}
                height={1100}
                className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="p-5">
                <p className="font-serif text-xl text-foreground">{c}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {services.filter((s) => s.category === c).length} curated treatments
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="surface-veil">
        <div className="mx-auto w-full max-w-7xl px-5 py-24 lg:px-10">
          <p className="eyebrow">Intelligent studio</p>
          <h2 className="mt-3 max-w-2xl text-4xl text-foreground sm:text-5xl">
            Luxury beauty studio meets AI business assistant
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {aiFeatures.map((f) => (
              <Link
                key={f.title}
                to={f.to}
                className="group gold-rule rounded-3xl bg-card/90 p-8 shadow-soft transition-transform hover:-translate-y-1"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blush/70">
                  <f.icon className="h-5 w-5 text-primary" />
                </span>
                <h3 className="mt-6 font-serif text-2xl text-foreground">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.copy}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-foreground">
                  Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-24 lg:px-10">
        <p className="eyebrow">Client favourites</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featured.map((s) => (
            <article key={s.id} className="rounded-3xl border border-border bg-card p-7 shadow-soft">
              <p className="eyebrow">{s.category}</p>
              <h3 className="mt-3 font-serif text-2xl text-foreground">{s.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.tagline}</p>
              <p className="mt-6 flex items-center justify-between text-sm text-foreground">
                <span>{s.durationMin} min</span>
                <span className="font-serif text-xl">R{s.price}</span>
              </p>
              <Link
                to="/book"
                search={{ service: s.id }}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Book this service
              </Link>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
