import { createServerFn } from "@tanstack/react-start";
import { streamText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { getGatewayModel } from "./ai-gateway.server";
import { services, faqs, salon, staff, demoAppointments } from "@/data/salon";

const serviceBrief = services
  .map(
    (s) =>
      `${s.name} (${s.category}) — ${s.durationMin} min, R${s.price}. ${s.description} Prep: ${s.prep.join("; ")}`,
  )
  .join("\n");

const faqBrief = faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n");

const ASSISTANT_SYSTEM = `You are the AI Beauty Concierge for ${salon.name}, a luxury beauty studio in Cape Town.
Tone: warm, elegant, concise. Never pushy.

Menu:
${serviceBrief}

FAQs:
${faqBrief}

Hours: ${salon.hours.map((h) => `${h.day}: ${h.time}`).join(" | ")}
Contact: ${salon.phone}, ${salon.email}, ${salon.address}

Rules:
- Recommend at most 2–3 services and explain why, including duration and preparation.
- Keep answers under 140 words, use short markdown-free paragraphs or simple dashes.
- Present everything as a suggestion, not a guarantee; a stylist confirms final details.
- Never give medical, diagnostic, dermatological or health advice. For skin conditions, pregnancy or injuries, advise speaking with a qualified professional and note we can adapt treatments.
- Never ask for or store ID numbers, card details or medical history.
- When the client seems ready, invite them to book and end with: BOOK:<service name>`;

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        messages: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string().min(1).max(4000),
            }),
          )
          .min(1)
          .max(30),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const result = streamText({
      model: getGatewayModel(),
      system: ASSISTANT_SYSTEM,
      messages: data.messages,
    });
    const text = await result.text;

    const match = text.match(/BOOK:\s*(.+)$/m);
    const suggested = match?.[1]?.trim();
    const service = suggested
      ? (services.find((s) => s.name.toLowerCase() === suggested.toLowerCase()) ??
        services.find((s) => suggested.toLowerCase().includes(s.name.toLowerCase())) ??
        services.find((s) => s.category.toLowerCase() === suggested.toLowerCase()))
      : undefined;

    return {
      reply: text.replace(/BOOK:.*$/m, "").trim(),
      suggestedServiceId: service?.id ?? null,
      suggestedServiceName: service?.name ?? null,
    };
  });

const planSchema = z.object({
  summary: z.string(),
  tasks: z.array(
    z.object({
      title: z.string(),
      day: z.string(),
      start: z.string(),
      end: z.string(),
      owner: z.string(),
      priority: z.enum(["Urgent", "High", "Medium", "Low"]),
      note: z.string(),
    }),
  ),
  conflicts: z.array(z.string()),
});

export type GeneratedPlan = z.infer<typeof planSchema>;

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ prompt: z.string().min(3).max(1200) }).parse(input),
  )
  .handler(async ({ data }): Promise<GeneratedPlan> => {
    const system = `You are the operations planner for ${salon.name}, a luxury beauty studio.
Team: ${staff.map((s) => `${s.name} (${s.role})`).join(", ")}.
Existing appointments today: ${demoAppointments
      .map((a) => `${a.time} ${a.client} — ${a.service} with ${a.staff}`)
      .join("; ")}.
Services and durations: ${services.map((s) => `${s.name} ${s.durationMin}min`).join(", ")}.

Build a realistic schedule of 5–9 tasks. Use 24-hour HH:MM times inside opening hours.
Owner must be a team member name. Day is a short label like "Tomorrow" or "Fri 12 Sep".
Priority: Urgent, High, Medium or Low — bridal and VIP work ranks highest.
List any double-booking or overlap you notice in "conflicts" (empty array if none).
Keep "note" under 20 words. Everything is a draft suggestion for a human to approve.`;

    const tryStructured = async (): Promise<GeneratedPlan> => {
      const result = streamText({
        model: getGatewayModel(),
        system,
        prompt: data.prompt,
        output: Output.object({ schema: planSchema }),
      });
      return await result.output;
    };

    const tryJsonText = async (priorText?: string): Promise<GeneratedPlan> => {
      const result = streamText({
        model: getGatewayModel(),
        system: `${system}\nRespond with ONLY a valid JSON object matching this shape: {"summary": string, "tasks": [{"title","day","start","end","owner","priority","note"}], "conflicts": string[]}. No markdown fences, no commentary.`,
        prompt: priorText
          ? `${data.prompt}\n\nYour previous reply was not valid JSON:\n${priorText.slice(0, 800)}\n\nReturn corrected JSON only.`
          : data.prompt,
      });
      const text = await result.text;
      const raw = text
        .replace(/```json|```/g, "")
        .trim()
        .replace(/^[^{]*/, "")
        .replace(/[^}]*$/, "");
      return planSchema.parse(JSON.parse(raw));
    };

    try {
      return await tryStructured();
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        try {
          return await tryJsonText(error.text ?? undefined);
        } catch (retryError) {
          console.error("Planner JSON fallback failed:", retryError);
          throw new Error("The planner couldn't structure that request. Try rephrasing it.");
        }
      }
      console.error("Planner generation failed:", error);
      try {
        return await tryJsonText();
      } catch (retryError) {
        console.error("Planner JSON fallback failed:", retryError);
        throw new Error("The planner couldn't structure that request. Try rephrasing it.");
      }
    }
  });

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        purpose: z.string().min(2).max(200),
        recipient: z.string().min(1).max(200),
        keyInfo: z.string().max(1500).default(""),
        tone: z.enum(["Formal", "Friendly", "Persuasive", "Warm"]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const result = streamText({
      model: getGatewayModel(),
      system: `You write client emails for ${salon.name}, a luxury beauty studio.
Sign off as "The ${salon.name} Team" with ${salon.phone}.
Tone: ${data.tone}. Keep it under 180 words, elegant and clear, no emojis, no invented prices or medical claims.
Return the email as: first line "Subject: ..." then a blank line then the body.`,
      prompt: `Purpose: ${data.purpose}\nRecipient: ${data.recipient}\nKey information: ${data.keyInfo || "none provided"}`,
    });

    const text = await result.text;
    const subjectMatch = text.match(/^\s*Subject:\s*(.+)$/m);
    return {
      subject: subjectMatch?.[1]?.trim() ?? data.purpose,
      body: text.replace(/^\s*Subject:.*$/m, "").trim(),
    };
  });
