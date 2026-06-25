import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";
const MAX_HISTORY_MESSAGES = 20;

const SYSTEM_PROMPT = `You are the SwiftShift Assistant, an AI chat assistant embedded in SwiftShift, a freight load-board platform used by truck drivers, carriers, dispatchers, and freight brokers.

You can hold a normal, free-flowing conversation like a general-purpose assistant (similar to ChatGPT) — answer questions on any topic, help draft messages, explain concepts, etc.

When the conversation touches SwiftShift or trucking/freight logistics, ground your answers in this context:
- Brokers post loads (pickup/delivery, rate, equipment type, weight, dates, commodity) to a load board.
- Drivers/carriers search the load board and request loads; brokers approve or reject requests, then assign a driver/carrier.
- Dispatch statuses: Available, Requested, Approved, Assigned, In Transit, Delivered, Completed, Cancelled, Rejected.
- Key documents: BOL (Bill of Lading) and POD (Proof of Delivery), usually uploaded after delivery.
- Payment topics: rate confirmations, quick pay, factoring, detention pay, layover pay, lumper fees, accessorial charges, TONU (Truck Ordered Not Used).
- Carrier verification: MC number, DOT number, cargo/liability insurance.
- Equipment types: Dry Van, Reefer, Flatbed, Step Deck, Power Only, Box Truck, Hotshot.
- Dashboards differ by role: drivers see search/myloads/documents/earnings/settings; brokers see post loads/approvals/assign/drivers/tracking/analytics/revenue.

If you're not certain about an exact UI flow in the app, give your best reasonable guess based on how load-board apps typically work, and suggest the user check the relevant dashboard section or contact support@swiftshift.com if it's something you can't resolve.

Keep replies conversational and concise — this chat renders in a small widget, so avoid overly long responses unless the user asks for detail.`;

type IncomingMessage = {
  role: "user" | "bot";
  text: string;
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "The assistant isn't configured yet. Missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  let body: { messages?: IncomingMessage[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const incoming = (body.messages ?? []).filter(
    (message) => typeof message?.text === "string" && message.text.trim().length > 0
  );

  if (incoming.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const trimmedHistory = incoming.slice(-MAX_HISTORY_MESSAGES);

  const anthropicMessages = trimmedHistory.map((message) => ({
    role: message.role === "user" ? "user" : "assistant",
    content: message.text,
  }));

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: anthropicMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      return NextResponse.json(
        { error: "The assistant is temporarily unavailable. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply: string =
      data?.content?.find((block: { type: string }) => block.type === "text")?.text ??
      "Sorry, I couldn't generate a response just now.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Something went wrong reaching the assistant." },
      { status: 500 }
    );
  }
}
