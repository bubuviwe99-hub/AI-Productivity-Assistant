import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Copy, Loader2, Mail, Pencil, RefreshCw, Send, Sparkle } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader, AiNotice } from "@/components/site/SiteLayout";
import { generateEmail } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Studio | Maison Élan" },
      {
        name: "description",
        content:
          "Generate polished salon emails — reminders, confirmations, cancellations, promotions and follow-ups — in a formal, friendly, persuasive or warm tone.",
      },
      { property: "og:title", content: "Smart Email Studio | Maison Élan" },
      {
        property: "og:description",
        content: "AI-drafted client emails in the Maison Élan house tone, reviewed before sending.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const purposes = [
  "Appointment reminder",
  "Booking confirmation",
  "Cancellation & reschedule",
  "Seasonal promotion",
  "Post-treatment follow-up",
];

const tones = ["Formal", "Friendly", "Persuasive", "Warm"] as const;

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState(purposes[0]);
  const [recipient, setRecipient] = useState("Lerato N. — bridal client");
  const [keyInfo, setKeyInfo] = useState(
    "Bridal Atelier Makeup, Saturday 12 September at 09:00, 150 minutes, arrive with a clean face, deposit already paid.",
  );
  const [tone, setTone] = useState<(typeof tones)[number]>("Warm");

  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmSend, setConfirmSend] = useState(false);

  async function generate() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { purpose, recipient, keyInfo, tone } });
      setDraft(res);
      setEditing(false);
    } catch {
      setError("The email studio is unavailable right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Client communications"
        title="Smart email studio"
        intro="Draft reminders, confirmations, cancellations, promotions and follow-ups in the Maison Élan voice. Every draft is reviewed and confirmed by a person before it is sent."
      />

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[380px_1fr] lg:px-10">
        <form
          className="h-fit space-y-6 rounded-3xl border border-border bg-card p-7 shadow-soft"
          onSubmit={(e) => {
            e.preventDefault();
            void generate();
          }}
        >
          <div>
            <label htmlFor="purpose" className="eyebrow">
              Purpose
            </label>
            <select
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="mt-3 w-full rounded-full border border-input bg-background px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {purposes.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="recipient" className="eyebrow">
              Recipient
            </label>
            <input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mt-3 w-full rounded-full border border-input bg-background px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            />
          </div>

          <div>
            <label htmlFor="keyinfo" className="eyebrow">
              Key information
            </label>
            <textarea
              id="keyinfo"
              rows={5}
              value={keyInfo}
              onChange={(e) => setKeyInfo(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            />
          </div>

          <fieldset>
            <legend className="eyebrow">Tone</legend>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  aria-pressed={tone === t}
                  className={cn(
                    "rounded-full border px-4 py-2.5 text-sm transition-colors",
                    tone === t
                      ? "border-gold bg-champagne/40 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Writing…
              </>
            ) : (
              <>
                <Sparkle className="h-4 w-4" /> Generate email
              </>
            )}
          </button>
        </form>

        <div className="space-y-5">
          <AiNotice>
            AI-generated draft. Check names, dates and prices before sending — nothing is sent
            without your explicit confirmation.
          </AiNotice>

          {error && (
            <p className="flex items-center gap-2 rounded-2xl bg-destructive/10 px-5 py-4 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" /> {error}
            </p>
          )}

          {loading && (
            <div className="space-y-3 rounded-3xl border border-border bg-card p-8" aria-hidden>
              <div className="h-5 w-2/3 animate-pulse rounded-full bg-secondary/70" />
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 animate-pulse rounded-full bg-secondary/50" />
              ))}
            </div>
          )}

          {!loading && !draft && !error && (
            <div className="gold-rule flex min-h-72 flex-col items-center justify-center rounded-3xl bg-card/70 p-10 text-center">
              <Mail className="h-8 w-8 text-gold" />
              <p className="mt-4 font-serif text-2xl text-foreground">Your draft appears here</p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Choose a purpose, recipient and tone, then generate a polished email in seconds.
              </p>
            </div>
          )}

          {draft && !loading && (
            <article className="rounded-3xl border border-border bg-card shadow-soft">
              <div className="border-b border-border px-7 py-5">
                <p className="eyebrow">Subject</p>
                {editing ? (
                  <input
                    aria-label="Email subject"
                    value={draft.subject}
                    onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                    className="mt-2 w-full rounded-full border border-input bg-background px-4 py-2.5 font-serif text-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  />
                ) : (
                  <h2 className="mt-2 font-serif text-2xl text-foreground">{draft.subject}</h2>
                )}
              </div>

              <div className="px-7 py-6">
                {editing ? (
                  <textarea
                    aria-label="Email body"
                    rows={14}
                    value={draft.body}
                    onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm leading-relaxed focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  />
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                    {draft.body}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 border-t border-border px-7 py-5">
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`);
                    toast.success("Email copied to clipboard.");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:bg-secondary/60"
                >
                  <Copy className="h-4 w-4" /> Copy
                </button>
                <button
                  type="button"
                  onClick={() => setEditing((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:bg-secondary/60"
                >
                  <Pencil className="h-4 w-4" /> {editing ? "Done editing" : "Edit"}
                </button>
                <button
                  type="button"
                  onClick={() => void generate()}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:bg-secondary/60"
                >
                  <RefreshCw className="h-4 w-4" /> Regenerate
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmSend(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  <Send className="h-4 w-4" /> Send to client
                </button>
              </div>
            </article>
          )}
        </div>
      </section>

      <AlertDialog open={confirmSend} onOpenChange={setConfirmSend}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-2xl">Send this email?</AlertDialogTitle>
            <AlertDialogDescription>
              This AI-assisted draft will be sent to {recipient}. Confirm that names, dates, prices
              and policies are correct — Maison Élan never sends AI content unreviewed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review again</AlertDialogCancel>
            <AlertDialogAction onClick={() => toast.success("Email queued for sending.")}>
              Confirm &amp; send
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SiteLayout>
  );
}
