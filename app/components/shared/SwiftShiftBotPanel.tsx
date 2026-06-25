"use client";

import { useEffect, useRef, useState } from "react";
import {
  Send,
  Truck,
  MessageCircle,
  Sparkles,
  Bot,
  User,
} from "lucide-react";

type ChatMessage = {
  role: "bot" | "user";
  text: string;
};

const SUGGESTED_QUESTIONS = [
  "What is a BOL?",
  "How do I post a load?",
  "How do I find available loads?",
  "When do I get paid for a load?",
];

const FALLBACK_ANSWER =
  "Sorry, I'm having trouble responding right now. Please try again in a moment, or email support@swiftshift.com.";

async function fetchReply(messages: ChatMessage[]): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status}`);
  }

  const data = await response.json();
  return data.reply ?? FALLBACK_ANSWER;
}

export default function SwiftShiftBotPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Hi, I'm the SwiftShift assistant. Ask me anything about loads, BOL/POD, dispatch, payments — or anything else.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", text: trimmed },
    ];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await fetchReply(nextMessages);
      setMessages((current) => [...current, { role: "bot", text: reply }]);
    } catch (error) {
      console.error("Failed to get assistant reply:", error);
      setMessages((current) => [
        ...current,
        { role: "bot", text: FALLBACK_ANSWER },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[620px] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl shadow-stone-400/30 sm:w-[420px]">
      {/* Header */}
      <div className="relative overflow-hidden bg-stone-950 px-5 py-4 text-white">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <Truck size={21} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-semibold tracking-wide">
                SwiftShift Assistant
              </h2>

              <span className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online
              </span>
            </div>

            <p className="mt-0.5 truncate text-xs text-stone-300">
              Loads, documents, dispatch, and payments
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-stone-50 via-white to-stone-50 px-4 py-5"
      >
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={`${message.role}-${index}`}
              className={`flex items-end gap-2 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white shadow-sm">
                  <Bot size={14} />
                </div>
              )}

              <div
                className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? "rounded-br-md bg-stone-950 text-white"
                    : "rounded-bl-md border border-stone-200 bg-white text-stone-800"
                }`}
              >
                {message.text}
              </div>

              {isUser && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-200 text-stone-700 shadow-sm">
                  <User size={14} />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-end justify-start gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white shadow-sm">
              <Bot size={14} />
            </div>

            <div className="rounded-2xl rounded-bl-md border border-stone-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400" />
              </div>
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
              <Sparkles size={14} />
              Try asking
            </div>

            <div className="grid grid-cols-1 gap-2">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => send(question)}
                  className="group flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-3 py-3 text-left text-sm text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50 hover:shadow-md"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700 transition group-hover:bg-stone-950 group-hover:text-white">
                    <MessageCircle size={16} />
                  </span>

                  <span className="font-medium">{question}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-stone-200 bg-white p-4">
        <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2 shadow-inner">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                send(input);
              }
            }}
            disabled={isLoading}
            placeholder="Ask me anything..."
            className="min-w-0 flex-1 bg-transparent px-1 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none disabled:cursor-not-allowed"
          />

          <button
            type="button"
            onClick={() => send(input)}
            disabled={!input.trim() || isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-950 text-white shadow-sm transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] text-stone-400">
          Powered by Claude — ask about your loads, or anything else.
        </p>
      </div>
    </div>
  );
}
