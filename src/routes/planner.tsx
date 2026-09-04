import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CalendarClock, Check, Loader2, Sparkle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader, AiNotice } from "@/components/site/SiteLayout";
import { generatePlan, type GeneratedPlan } from "@/lib/ai.functions";
import { demoAppointments, staff } from "@/data/salon";
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

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Maison Élan Studio Operations" },
      {
        name: "description",
        content:
          "Turn a sentence into a prioritised salon schedule: staff tasks, appointment timeline and automatic conflict detection for the Maison Élan team.",
      },
      { property: "og:title", content: "AI Task Planner | Maison Élan" },
      {
        property: "og:description",
        content: "Prioritised daily and weekly studio schedules generated from natural language.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

type Task = GeneratedPlan["tasks"][number] & { id: string; done: boolean };

const priorityStyles: Record<string, string> = {
  Urgent: "bg-destructive/12 text-destructive border-destructive/30",
  High: "bg-blush/60 text-blush-foreground border-gold/40",
  Medium: "bg-champagne/40 text-foreground border-gold/30",
  Low: "bg-sage/30 text-foreground border-border",
};

const prompts = [
  "Create tomorrow's schedule and prioritise bridal clients.",
  "Plan a Saturday with two bridal parties and a full lash column.",
  "Build a weekly restock, deep-clean and social content plan.",
];

function PlannerPage() {
  const run = useServerFn(generatePlan);
  const [prompt, setPrompt] = useState(prompts[0]);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmApply, setConfirmApply] = useState(false);
  const [applied, setApplied] = useState(false);

  async function generate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setApplied(false);
    try {
      const result = await run({ data: { prompt } });
      setPlan(result);
      setTasks(
        result.tasks.map((t, i) => ({ ...t, id: `${i}-${t.start}`, done: false })),
      );
    } catch (err) {
      console.error("Planner generation failed:", err);
      setError("The planner could not generate a schedule. Try rephrasing your request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Studio operations"
        title="AI task planner"
        intro="Describe the day in plain language and the planner drafts a prioritised schedule across the team, flagging any overlaps it spots. Nothing reaches the live diary until a manager approves it."
      />

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[340px_1fr] lg:px-10">
        <aside className="space-y-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <label htmlFor="planner-prompt" className="eyebrow">
              Describe the plan
            </label>
            <textarea
              id="planner-prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            />
            <button
              type="button"
              onClick={() => void generate()}
              disabled={loading}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Drafting schedule…
                </>
              ) : (
                <>
                  <Sparkle className="h-4 w-4" /> Generate schedule
                </>
              )}
            </button>
            <div className="mt-4 space-y-2">
              {prompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-left text-xs text-muted-foreground hover:text-foreground"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <p className="eyebrow">Today's diary</p>
            <ul className="mt-4 space-y-3">
              {demoAppointments.map((a) => (
                <li key={a.time} className="flex gap-3 text-xs">
                  <span className="font-serif text-base text-foreground">{a.time}</span>
                  <span className="text-muted-foreground">
                    {a.client} · {a.service}
                    <span className="block text-[0.7rem] text-muted-foreground/70">{a.staff}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <p className="eyebrow">Team</p>
            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
              {staff.map((s) => (
                <li key={s.id} className="flex justify-between gap-3">
                  <span className="text-foreground">{s.name}</span>
                  <span>{s.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="space-y-6">
          <AiNotice>
            AI-generated draft schedule. Review owners and times, then approve before anything is
            shared with staff or clients.
          </AiNotice>

          {error && (
            <p className="flex items-center gap-2 rounded-2xl bg-destructive/10 px-5 py-4 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" /> {error}
            </p>
          )}

          {loading && (
            <div className="space-y-3" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-secondary/60" />
              ))}
            </div>
          )}

          {!loading && !plan && !error && (
            <div className="gold-rule flex min-h-64 flex-col items-center justify-center rounded-3xl bg-card/70 p-10 text-center">
              <CalendarClock className="h-8 w-8 text-gold" />
              <p className="mt-4 font-serif text-2xl text-foreground">No schedule yet</p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Describe tomorrow in a sentence — the planner will build a prioritised timeline for
                the studio.
              </p>
            </div>
          )}

          {plan && !loading && (
            <>
              <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
                <p className="eyebrow">Summary</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{plan.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(["Urgent", "High", "Medium", "Low"] as const).map((p) => (
                    <span
                      key={p}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs",
                        priorityStyles[p],
                      )}
                    >
                      {p}: {tasks.filter((t) => t.priority === p).length}
                    </span>
                  ))}
                </div>
              </div>

              {plan.conflicts.length > 0 && (
                <div className="rounded-3xl border border-destructive/30 bg-destructive/8 p-6">
                  <p className="flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4" /> Possible conflicts detected
                  </p>
                  <ul className="mt-3 space-y-1.5 text-xs text-destructive/90">
                    {plan.conflicts.map((c) => (
                      <li key={c}>• {c}</li>
                    ))}
                  </ul>
                </div>
              )}

              <ol className="relative space-y-3 border-l border-border pl-6">
                {tasks.map((t) => (
                  <li key={t.id} className="relative">
                    <span className="absolute -left-[1.9rem] top-6 h-2.5 w-2.5 rounded-full bg-gold" aria-hidden />
                    <div
                      className={cn(
                        "rounded-2xl border border-border bg-card p-5 shadow-soft transition-opacity",
                        t.done && "opacity-55",
                      )}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {t.day} · {t.start}–{t.end} · {t.owner}
                          </p>
                          <p
                            className={cn(
                              "mt-1 font-serif text-xl text-foreground",
                              t.done && "line-through",
                            )}
                          >
                            {t.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">{t.note}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full border px-3 py-1 text-[0.7rem]",
                              priorityStyles[t.priority],
                            )}
                          >
                            {t.priority}
                          </span>
                          <button
                            type="button"
                            aria-label={t.done ? `Reopen ${t.title}` : `Mark ${t.title} done`}
                            onClick={() =>
                              setTasks((list) =>
                                list.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)),
                              )
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Remove ${t.title}`}
                            onClick={() => setTasks((list) => list.filter((x) => x.id !== t.id))}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmApply(true)}
                  disabled={tasks.length === 0}
                  className="rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-40"
                >
                  Approve &amp; apply to diary
                </button>
                <button
                  type="button"
                  onClick={() => void generate()}
                  className="gold-rule rounded-full bg-card px-6 py-3 text-sm"
                >
                  Regenerate
                </button>
                {applied && (
                  <span className="text-xs text-muted-foreground" aria-live="polite">
                    Applied to the studio diary.
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <AlertDialog open={confirmApply} onOpenChange={setConfirmApply}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-2xl">Apply this schedule?</AlertDialogTitle>
            <AlertDialogDescription>
              {tasks.length} AI-suggested tasks will be written to the studio diary and visible to
              staff. Clients are not notified automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep reviewing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setApplied(true);
                toast.success("Schedule applied to the studio diary.");
              }}
            >
              Confirm &amp; apply
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SiteLayout>
  );
}
