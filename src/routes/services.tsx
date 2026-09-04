import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clock, ArrowRight } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { categories, services } from "@/data/salon";
import { cn } from "@/lib/utils";

type Search = { category?: string };

export const Route = createFileRoute("/services")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    category: typeof search["category"] === "string" ? (search["category"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Services & Pricing | Maison Élan Beauty Atelier" },
      {
        name: "description",
        content:
          "Explore makeup, lash extensions, massages, hair extensions and nail treatments at Maison Élan, with durations, pricing and preparation notes.",
      },
      { property: "og:title", content: "Services & Pricing | Maison Élan" },
      {
        property: "og:description",
        content: "Durations, pricing and preparation notes for every Maison Élan treatment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/services" });
  const list = category ? services.filter((s) => s.category === category) : services;

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="The menu"
        title="Treatments made to measure"
        intro="Every service begins with a short consultation so the artistry suits your features, your calendar and the occasion. Prices are guides — final quotes are confirmed in studio."
      />

      <section className="mx-auto w-full max-w-7xl px-5 py-16 lg:px-10">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter services">
          <button
            type="button"
            onClick={() => navigate({ search: {} })}
            className={cn(
              "rounded-full border border-border px-5 py-2 text-sm transition-colors",
              !category ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary/60",
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => navigate({ search: { category: c } })}
              className={cn(
                "rounded-full border border-border px-5 py-2 text-sm transition-colors",
                category === c ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary/60",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-2">
          {list.map((s) => (
            <article
              key={s.id}
              className="group grid overflow-hidden rounded-3xl border border-border bg-card shadow-soft sm:grid-cols-[0.8fr_1.2fr]"
            >
              <img
                src={s.image}
                alt={s.name}
                loading="lazy"
                width={900}
                height={1100}
                className="h-full min-h-52 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="p-7">
                <p className="eyebrow">{s.category}</p>
                <h2 className="mt-2 font-serif text-2xl text-foreground">{s.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {s.prep.map((p) => (
                    <li key={p} className="flex gap-2 text-xs text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-gold" /> {s.durationMin} min
                  </span>
                  <span className="font-serif text-2xl text-foreground">R{s.price}</span>
                </div>
                <Link
                  to="/book"
                  search={{ service: s.id }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  Book this service <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
