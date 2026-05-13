"use client"

import { useState } from "react";

export function Switch({ defaultActive = false }: { defaultActive?: boolean }) {
  const [active, setActive] = useState(defaultActive);

  return (
    <button
      type="button"
      onClick={() => setActive((prev) => !prev)}
      className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition ${
        active ? "bg-green-600" : "bg-slate-300"
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
