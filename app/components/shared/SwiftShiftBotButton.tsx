"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import SwiftShiftBotPanel from "./SwiftShiftBotPanel";

export default function SwiftShiftBot() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="relative animate-in fade-in slide-in-from-bottom-3 duration-200">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute -right-3 -top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-stone-950 text-white shadow-lg shadow-stone-400/40 ring-4 ring-white transition hover:scale-105 hover:bg-stone-800"
            aria-label="Close chat"
          >
            <X size={16} />
          </button>

          <SwiftShiftBotPanel />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-stone-950 text-white shadow-xl shadow-stone-400/50 transition hover:-translate-y-1 hover:scale-105 hover:bg-stone-800"
          aria-label="Open assistant"
        >
          <span className="absolute inset-0 rounded-full bg-stone-950 opacity-30 blur-lg transition group-hover:opacity-50" />

          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" />
          </span>

          <MessageCircle size={24} className="relative z-10" />
        </button>
      )}
    </div>
  );
}