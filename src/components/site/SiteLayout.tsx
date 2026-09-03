import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";
import { salon } from "@/data/salon";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/book", label: "Book" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/planner", label: "AI Planner" },
  { to: "/email-generator", label: "Email Studio" },
  { to: "/contact", label: "Contact" },
] as const;

function Wordmark() {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label={`${salon.name} home`}>
      <span className="relative flex h-10 w-10 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-blush/70" />
        <span className="absolute inset-0 translate-x-1.5 rounded-full border border-gold/60" />
        <span className="relative font-serif text-lg text-primary">É</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-xl tracking-wide text-foreground">{salon.name}</span>
        <span className="eyebrow mt-1 text-[0.55rem]">Beauty Atelier</span>
      </span>
    </Link>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-10">
          <Wordmark />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                activeProps={{ className: "text-foreground bg-secondary/70" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/book"
              className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              Book appointment
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden border-t border-border/60 bg-background transition-[max-height] duration-300 lg:hidden",
            open ? "max-h-[26rem]" : "max-h-0",
          )}
        >
          <nav className="flex flex-col px-5 py-3" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="surface-deep mt-24">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 md:grid-cols-3 lg:px-10">
          <div>
            <p className="font-serif text-3xl">{salon.name}</p>
            <p className="mt-3 max-w-xs text-sm text-deep-foreground/70">{salon.tagline}</p>
          </div>
          <div className="space-y-3 text-sm text-deep-foreground/80">
            <p className="eyebrow text-champagne">Visit</p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-champagne" /> {salon.address}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-champagne" /> {salon.phone}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-champagne" /> {salon.email}
            </p>
          </div>
          <div className="space-y-2 text-sm text-deep-foreground/80">
            <p className="eyebrow text-champagne">Hours</p>
            {salon.hours.map((h) => (
              <p key={h.day} className="flex justify-between gap-6">
                <span>{h.day}</span>
                <span className="text-deep-foreground/60">{h.time}</span>
              </p>
            ))}
          </div>
        </div>
        <div className="border-t border-deep-foreground/15">
          <p className="mx-auto w-full max-w-7xl px-5 py-6 text-xs text-deep-foreground/60 lg:px-10">
            © {new Date().getFullYear()} {salon.name}. AI features produce suggestions only —
            a team member reviews and confirms every email, booking and schedule change.
          </p>
        </div>
      </footer>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="relative overflow-hidden surface-veil">
      <span className="orb -top-24 -left-16 h-72 w-72 bg-mauve" aria-hidden />
      <span className="orb -right-10 top-10 h-64 w-64 bg-sage" aria-hidden />
      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <p className="eyebrow animate-rise">{eyebrow}</p>
        <h1 className="animate-rise mt-4 max-w-3xl text-4xl leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="animate-rise mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {intro}
        </p>
      </div>
    </section>
  );
}

export function AiNotice({ children }: { children: ReactNode }) {
  return (
    <p className="gold-rule flex items-start gap-2 rounded-xl bg-champagne/20 px-4 py-3 text-xs leading-relaxed text-foreground/80">
      <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden />
      <span>{children}</span>
    </p>
  );
}
