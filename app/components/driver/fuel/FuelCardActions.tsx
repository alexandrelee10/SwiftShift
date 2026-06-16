"use client";

import { useState } from "react";
import { AlertTriangle, Eye, X, ShieldCheck } from "lucide-react";

export default function FuelCardActions() {
  const [pinOpen, setPinOpen] = useState(false);
  const [lostOpen, setLostOpen] = useState(false);
  const [reportedLost, setReportedLost] = useState(false);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => setPinOpen(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-blue-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800"
        >
          <Eye size={16} />
          View PIN
        </button>

        <button
          onClick={() => setLostOpen(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <AlertTriangle size={16} />
          Report Lost
        </button>
      </div>

      {pinOpen && (
        <Modal onClose={() => setPinOpen(false)} title="Fuel Card PIN">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your secure fuel card PIN
            </p>

            <p className="mt-4 font-mono text-4xl font-bold tracking-[0.35em] text-slate-950 dark:text-white">
              4829
            </p>
          </div>

          <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
            Do not share this PIN with anyone. Only use it at approved fueling
            locations.
          </div>
        </Modal>
      )}

      {lostOpen && (
        <Modal onClose={() => setLostOpen(false)} title="Report Lost Card">
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
            Reporting this card as lost will disable it and prevent future fuel
            purchases.
          </div>

          <button
            onClick={() => setReportedLost((prev) => !prev)}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              reportedLost
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            <ShieldCheck size={16} />
            {reportedLost ? "Card Reported Lost" : "Confirm Report Lost"}
          </button>

          {reportedLost && (
            <p className="mt-3 text-center text-sm text-green-600 dark:text-green-400">
              This card has been marked as lost.
            </p>
          )}
        </Modal>
      )}
    </>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}