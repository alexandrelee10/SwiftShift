"use client";

import { useState } from "react";

type SearchFormData = {
  origin: string;
  destination: string;
  weight: string;
  equipmentType: string;
  pickupDate: string;
};

type LoadResult = {
  id: string;
  referenceNumber: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  rate: string;
  equipmentType: string;
  weight: number | null;
  pickupDate: string;
};

export default function SearchFilters() {
  const [form, setForm] = useState<SearchFormData>({
    origin: "",
    destination: "",
    weight: "",
    equipmentType: "",
    pickupDate: "",
  });

  const [results, setResults] = useState<LoadResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/loads/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("SEARCH RESPONSE:", data);

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setResults([]);
        return;
      }

      setResults(data.loads ?? []);
    } catch {
      setError("Failed to search loads");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InputBox
            label="Origin"
            name="origin"
            value={form.origin}
            onChange={onChange}
            placeholder="City, state, or ZIP"
          />

          <InputBox
            label="Destination"
            name="destination"
            value={form.destination}
            onChange={onChange}
            placeholder="City, state, or ZIP"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <InputBox
            label="Weight lbs"
            name="weight"
            value={form.weight}
            onChange={onChange}
            placeholder="45000"
          />

          <InputBox
            label="Equipment"
            name="equipmentType"
            value={form.equipmentType}
            onChange={onChange}
            placeholder="Dry Van"
          />

          <InputBox
            label="Pickup Date"
            name="pickupDate"
            type="date"
            value={form.pickupDate}
            onChange={onChange}
          />

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="h-[52px] w-full rounded-md bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </form>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Found {results.length} loads
      </p>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        {results.map((load) => (
          <div
            key={load.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {load.originCity}, {load.originState} → {load.destinationCity},{" "}
              {load.destinationState}
            </h3>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Equipment: {load.equipmentType}
            </p>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Rate: ${load.rate}
            </p>

            {load.weight ? (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Weight: {load.weight.toLocaleString()} lbs
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function InputBox({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="rounded-md border border-slate-300 bg-white px-3 py-2 transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950">
      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
      />
    </div>
  );
}