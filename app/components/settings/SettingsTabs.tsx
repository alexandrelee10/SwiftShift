"use client";

import { useState } from "react";

import { useEffect } from "react";
import { useTheme } from "next-themes";
const tabs = ["Account", "Preferences", "Notifications", "Security", "Integrations"];

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("Account");

  return (
    <div className="border-b border-slate-200">
      <div className="flex gap-6 overflow-x-auto text-sm font-medium">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap border-b-2 pb-3 transition ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Switch({ defaultActive = false }: { defaultActive?: boolean }) {
  const [active, setActive] = useState(defaultActive);

  return (
    <button
      type="button"
      onClick={() => setActive((prev) => !prev)}
      className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition ${
        active ? "bg-blue-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white transition ${
          active ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}




export function ThemeButton({
  icon,
  label,
  theme,
}: {
  icon: React.ReactNode;
  label: string;
  theme: "light" | "dark" | "system";
}) {
  const { theme: currentTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const active = mounted && currentTheme === theme;

  return (
    <button
      type="button"
      onClick={() => setTheme(theme)}
      className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium transition ${
        active
          ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
          : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}