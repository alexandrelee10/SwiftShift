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
        className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-md border border-zinc-300 bg-white px-3 py-2">
            <label className="block text-[11px] font-medium text-zinc-500">
              Origin
            </label>
            <input
              type="text"
              name="origin"
              value={form.origin}
              onChange={onChange}
              placeholder="City, state, or ZIP"
              className="mt-1 w-full bg-transparent text-sm text-zinc-900 outline-none"
            />
          </div>

          <div className="rounded-md border border-zinc-300 bg-white px-3 py-2">
            <label className="block text-[11px] font-medium text-zinc-500">
              Destination
            </label>
            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={onChange}
              placeholder="City, state, or ZIP"
              className="mt-1 w-full bg-transparent text-sm text-zinc-900 outline-none"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="rounded-md border border-zinc-300 bg-white px-3 py-2">
            <label className="block text-[11px] font-medium text-zinc-500">
              Weight lbs
            </label>
            <input
              type="text"
              name="weight"
              value={form.weight}
              onChange={onChange}
              placeholder="45000"
              className="mt-1 w-full bg-transparent text-sm text-zinc-900 outline-none"
            />
          </div>

          <div className="rounded-md border border-zinc-300 bg-white px-3 py-2">
            <label className="block text-[11px] font-medium text-zinc-500">
              Equipment
            </label>
            <input
              type="text"
              name="equipmentType"
              value={form.equipmentType}
              onChange={onChange}
              placeholder="Dry Van"
              className="mt-1 w-full bg-transparent text-sm text-zinc-900 outline-none"
            />
          </div>

          <div className="rounded-md border border-zinc-300 bg-white px-3 py-2">
            <label className="block text-[11px] font-medium text-zinc-500">
              Pickup Date
            </label>
            <input
              type="date"
              name="pickupDate"
              value={form.pickupDate}
              onChange={onChange}
              className="mt-1 w-full bg-transparent text-sm text-zinc-900 outline-none"
            />
          </div>

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

      <p className="text-sm text-zinc-500">Found {results.length} loads</p>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        {results.map((load) => (
          <div
            key={load.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-zinc-900">
              {load.originCity}, {load.originState} → {load.destinationCity},{" "}
              {load.destinationState}
            </h3>

            <p className="mt-1 text-sm text-zinc-600">
              Equipment: {load.equipmentType}
            </p>

            <p className="mt-1 text-sm text-zinc-600">Rate: ${load.rate}</p>

            {load.weight ? (
              <p className="mt-1 text-sm text-zinc-600">
                Weight: {load.weight.toLocaleString()} lbs
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}