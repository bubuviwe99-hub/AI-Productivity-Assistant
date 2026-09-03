import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { faqs, salon } from "@/data/salon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Visit | Maison Élan Beauty Atelier" },
      {
        name: "description",
        content:
          "Find Maison Élan in Cape Town — opening hours, phone, email and answers to the questions clients ask most.",
      },
      { property: "og:title", content: "Contact Maison Élan" },
      {
        property: "og:description",
        content: "Opening hours, location and studio FAQs for Maison Élan beauty atelier.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Say hello"
        title="Visit the atelier"
        intro="We are a five-minute walk from Church Square with secure parking on Loop Street. Reach us for bookings, bridal parties and corporate wellness days."
      />

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2 lg:px-10">
        <div className="space-y-8">
          <div className="gold-rule space-y-4 rounded-3xl bg-card p-8 shadow-soft">
            <p className="eyebrow">Studio details</p>
            <p className="flex items-center gap-3 text-sm text-foreground">
              <MapPin className="h-4 w-4 text-gold" /> {salon.address}
            </p>
            <p className="flex items-center gap-3 text-sm text-foreground">
              <Phone className="h-4 w-4 text-gold" /> {salon.phone}
            </p>
            <p className="flex items-center gap-3 text-sm text-foreground">
              <Mail className="h-4 w-4 text-gold" /> {salon.email}
            </p>
            <div className="mt-4 space-y-2 border-t border-border pt-4">
              {salon.hours.map((h) => (
                <p key={h.day} className="flex justify-between text-sm text-muted-foreground">
                  <span>{h.day}</span>
                  <span>{h.time}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
            <p className="eyebrow">Questions</p>
            <Accordion type="single" collapsible className="mt-4">
              {faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger className="text-left font-serif text-lg">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <form
          className="h-fit rounded-3xl border border-border bg-card p-8 shadow-soft"
          onSubmit={(e) => {
            e.preventDefault();
            setSending(true);
            window.setTimeout(() => {
              setSending(false);
              setSent(true);
              toast.success("Message received — we reply within one business day.");
            }, 900);
          }}
        >
          <p className="eyebrow">Send a message</p>
          <h2 className="mt-3 font-serif text-3xl text-foreground">How can we help?</h2>

          <div className="mt-7 space-y-5">
            <Field id="name" label="Full name" required />
            <Field id="email" label="Email" type="email" required />
            <Field id="phone" label="Phone (optional)" type="tel" />
            <div>
              <label htmlFor="message" className="text-xs tracking-wide text-muted-foreground uppercase">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                placeholder="Tell us about the occasion, date and services you have in mind."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={sending}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {sending ? "Sending…" : (
              <>
                Send message <Send className="h-4 w-4" />
              </>
            )}
          </button>
          <p aria-live="polite" className="mt-3 text-center text-xs text-muted-foreground">
            {sent ? "Thank you — a consultant will be in touch shortly." : "We never share your details."}
          </p>
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        className="mt-2 w-full rounded-full border border-input bg-background px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      />
    </div>
  );
}
