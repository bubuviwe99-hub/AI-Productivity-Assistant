import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import { Check, ChevronLeft, ChevronRight, CalendarDays, Clock, Sparkle } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader, AiNotice } from "@/components/site/SiteLayout";
import { services, timeSlots } from "@/data/salon";
import { cn } from "@/lib/utils";

type Search = { service?: string };

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    service: typeof search.service === "string" ? search.service : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book an Appointment | Maison Élan" },
      {
        name: "description",
        content:
          "Reserve makeup, lashes, massage, hair extension or nail appointments at Maison Élan in four calm steps.",
      },
      { property: "og:title", content: "Book an Appointment | Maison Élan" },
      {
        property: "og:description",
        content: "Choose your service, date, time and details — confirmation in under a minute.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookPage,
});

const steps = ["Service", "Date", "Time", "Your details", "Confirmation"];

function BookPage() {
  const { service: preselected } = Route.useSearch();
  const [step, setStep] = useState(preselected ? 1 : 0);
  const [serviceId, setServiceId] = useState<string | undefined>(preselected);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string | undefined>();
  const [details, setDetails] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const service = useMemo(() => services.find((s) => s.id === serviceId), [serviceId]);
  const days = useMemo(
    () => Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1)),
    [],
  );

  const canContinue =
    (step === 0 && !!service) ||
    (step === 1 && !!date) ||
    (step === 2 && !!time) ||
    (step === 3 && details.name.trim().length > 1 && /.+@.+\..+/.test(details.email));

  function confirm() {
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setReference(`ME-${Math.floor(1000 + Math.random() * 8999)}`);
      setStep(4);
      toast.success("Appointment confirmed — a reminder email is on its way.");
    }, 1100);
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Reservations"
        title="Book your appointment"
        intro="Four short steps. Nothing is charged online — a 20% deposit is requested in studio for services over two hours."
      />

      <section className="mx-auto w-full max-w-4xl px-5 py-16 lg:px-10">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-2" aria-label="Booking progress">
          {steps.map((label, i) => (
            <li key={label} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-colors",
                  i < step
                    ? "border-primary bg-primary text-primary-foreground"
                    : i === step
                      ? "border-gold bg-champagne/40 text-foreground"
                      : "border-border bg-card text-muted-foreground",
                )}
                aria-current={i === step ? "step" : undefined}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-xs",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {i < steps.length - 1 && (
                <span className="hidden h-px w-6 bg-border sm:block" aria-hidden />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-9">
          {step === 0 && (
            <div>
              <h2 className="font-serif text-3xl text-foreground">Choose your service</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setServiceId(s.id)}
                    className={cn(
                      "rounded-2xl border p-5 text-left transition-colors",
                      serviceId === s.id
                        ? "border-gold bg-champagne/25"
                        : "border-border bg-background hover:bg-secondary/50",
                    )}
                  >
                    <p className="eyebrow">{s.category}</p>
                    <p className="mt-2 font-serif text-lg text-foreground">{s.name}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {s.durationMin} min · R{s.price}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-serif text-3xl text-foreground">Pick a date</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Next 14 days shown. Sundays are closed.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {days.map((d) => {
                  const closed = d.getDay() === 0;
                  const active = date && format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
                  return (
                    <button
                      key={d.toISOString()}
                      type="button"
                      disabled={closed}
                      onClick={() => setDate(d)}
                      className={cn(
                        "rounded-2xl border p-4 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                        active
                          ? "border-gold bg-champagne/25"
                          : "border-border bg-background hover:bg-secondary/50",
                      )}
                    >
                      <span className="block text-[0.65rem] tracking-widest text-muted-foreground uppercase">
                        {format(d, "EEE")}
                      </span>
                      <span className="mt-1 block font-serif text-xl text-foreground">
                        {format(d, "d")}
                      </span>
                      <span className="block text-[0.65rem] text-muted-foreground">
                        {format(d, "MMM")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-serif text-3xl text-foreground">Select a time</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {service?.name} · {service?.durationMin} minutes
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {timeSlots.map((t, i) => {
                  const unavailable = i % 4 === 1;
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={unavailable}
                      onClick={() => setTime(t)}
                      className={cn(
                        "rounded-full border px-4 py-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-35",
                        time === t
                          ? "border-gold bg-champagne/30"
                          : "border-border bg-background hover:bg-secondary/50",
                      )}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-serif text-3xl text-foreground">Your details</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {(
                  [
                    ["name", "Full name", "text"],
                    ["email", "Email", "email"],
                    ["phone", "Phone", "tel"],
                  ] as const
                ).map(([key, label, type]) => (
                  <div key={key} className={key === "phone" ? "sm:col-span-2" : undefined}>
                    <label htmlFor={key} className="text-xs tracking-wide text-muted-foreground uppercase">
                      {label}
                    </label>
                    <input
                      id={key}
                      type={type}
                      value={details[key]}
                      onChange={(e) => setDetails({ ...details, [key]: e.target.value })}
                      className="mt-2 w-full rounded-full border border-input bg-background px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label htmlFor="notes" className="text-xs tracking-wide text-muted-foreground uppercase">
                    Notes for your artist (optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={details.notes}
                    onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    placeholder="Occasion, allergies to note, inspiration links."
                  />
                </div>
              </div>
              <div className="mt-6">
                <AiNotice>
                  Please do not share medical, health or payment information here. We only use these
                  details to confirm your appointment.
                </AiNotice>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blush/70">
                <Check className="h-7 w-7 text-primary" />
              </span>
              <h2 className="mt-6 font-serif text-4xl text-foreground">You're booked</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Reference {reference}. A confirmation has been sent to {details.email}.
              </p>
              <div className="mx-auto mt-8 max-w-sm space-y-2 rounded-2xl border border-border bg-background p-6 text-left text-sm">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="text-foreground">{service?.name}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="text-foreground">{date && format(date, "EEE d MMM yyyy")}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="text-foreground">{time}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-serif text-lg text-foreground">R{service?.price}</span>
                </p>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  to="/assistant"
                  className="gold-rule inline-flex items-center gap-2 rounded-full bg-card px-6 py-3 text-sm"
                >
                  <Sparkle className="h-4 w-4 text-gold" /> Ask about preparation
                </Link>
                <Link
                  to="/"
                  className="rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground"
                >
                  Back home
                </Link>
              </div>
            </div>
          )}

          {step < 4 && (
            <div className="mt-9 flex items-center justify-between border-t border-border pt-6">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>

              <div className="flex items-center gap-4">
                {service && (
                  <span className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5 text-gold" />
                      {date ? format(date, "d MMM") : "—"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-gold" />
                      {time ?? "—"}
                    </span>
                  </span>
                )}
                <button
                  type="button"
                  disabled={!canContinue || submitting}
                  onClick={() => (step === 3 ? confirm() : setStep((s) => s + 1))}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  {submitting
                    ? "Confirming…"
                    : step === 3
                      ? "Confirm booking"
                      : "Continue"}
                  {!submitting && <ChevronRight className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
