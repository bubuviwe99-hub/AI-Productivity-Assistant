import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, Sparkle, RotateCcw, AlertCircle } from "lucide-react";
import { SiteLayout, PageHeader, AiNotice } from "@/components/site/SiteLayout";
import { askAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Beauty Concierge | Maison Élan" },
      {
        name: "description",
        content:
          "Chat with the Maison Élan AI concierge for service recommendations, durations, preparation guidance and booking help.",
      },
      { property: "og:title", content: "AI Beauty Concierge | Maison Élan" },
      {
        property: "og:description",
        content: "Personalised beauty service suggestions, prep notes and booking guidance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; content: string; serviceId?: string | null; serviceName?: string | null };

const suggestions = [
  "I'm a bridesmaid in three weeks — what should I book?",
  "How long do Russian volume lashes take and how do I prepare?",
  "Something relaxing for a stressful week under R900?",
  "Which nail set lasts longest for a beach holiday?",
];

const greeting: Msg = {
  role: "assistant",
  content:
    "Welcome to Maison Élan. Tell me about the occasion, the look you love or how much time you have, and I'll suggest a treatment plan — including how long it takes and how to prepare.",
};

function AssistantPage() {
  const ask = useServerFn(askAssistant);
  const [messages, setMessages] = useState<Msg[]>([greeting]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || pending) return;
    const next: Msg[] = [...messages, { role: "user", content: clean }];
    setMessages(next);
    setInput("");
    setPending(true);
    setError(null);

    try {
      const res = await ask({
        data: { messages: next.map(({ role, content }) => ({ role, content })).slice(-16) },
      });
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: res.reply,
          serviceId: res.suggestedServiceId,
          serviceName: res.suggestedServiceName,
        },
      ]);
    } catch {
      setError("The concierge is unavailable right now. Please try again in a moment.");
    } finally {
      setPending(false);
    }
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="AI concierge"
        title="Your beauty assistant"
        intro="Ask about services, timings, preparation or studio policies. Answers are AI-generated suggestions — your artist confirms the final plan in studio."
      />

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[1fr_320px] lg:px-10">
        <div className="flex h-[36rem] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush/70">
                <Sparkle className="h-4 w-4 text-primary" />
              </span>
              <div>
                <p className="text-sm text-foreground">Maison Élan Concierge</p>
                <p className="text-xs text-muted-foreground">
                  {pending ? "Typing…" : "Online · AI-assisted"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setMessages([greeting]);
                setError(null);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" /> New chat
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={m.role === "user" ? "max-w-[80%]" : "max-w-[85%]"}>
                  <div
                    className={
                      m.role === "user"
                        ? "rounded-3xl rounded-br-md bg-primary px-5 py-3 text-sm leading-relaxed text-primary-foreground"
                        : "text-sm leading-relaxed whitespace-pre-wrap text-foreground"
                    }
                  >
                    {m.content}
                  </div>
                  {m.serviceId && (
                    <Link
                      to="/book"
                      search={{ service: m.serviceId }}
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-champagne/50 px-4 py-2 text-xs text-foreground transition-colors hover:bg-champagne/80"
                    >
                      Book {m.serviceName}
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {pending && (
              <div className="flex gap-1.5" aria-label="Concierge is typing">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 animate-bounce rounded-full bg-mauve"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            )}

            {error && (
              <p className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4" /> {error}
              </p>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="flex items-center gap-3 border-t border-border px-4 py-4"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <label htmlFor="chat-input" className="sr-only">
              Message the concierge
            </label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a service, timing or preparation…"
              className="flex-1 rounded-full border border-input bg-background px-5 py-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              aria-label="Send message"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <p className="eyebrow">Try asking</p>
            <div className="mt-4 space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  disabled={pending}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-left text-xs leading-relaxed text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <AiNotice>
            Responses are AI-generated suggestions, not professional or medical advice. We never ask
            for health records, ID numbers or payment details in chat.
          </AiNotice>
        </aside>
      </section>
    </SiteLayout>
  );
}
