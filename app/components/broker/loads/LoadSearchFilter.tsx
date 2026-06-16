"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Box,
  DollarSign,
  MapPin,
  Navigation,
  Search,
  Truck,
  X,
} from "lucide-react";

export default function LoadSearchFilters() {
  const router = useRouter();

  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    equipment: "",
    minRate: "",
    maxDistance: "",
    loadType: "",
  });

  function updateFilter(name: keyof typeof filters, value: string) {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSearch() {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) {
        params.set(key, value.trim());
      }
    });

    router.push(`/dashboard/broker/brokerLoads/load?${params.toString()}`);
  }

  function clearFilters() {
    setFilters({
      origin: "",
      destination: "",
      equipment: "",
      minRate: "",
      maxDistance: "",
      loadType: "",
    });

    router.push("/dashboard/broker/brokerLoads/load");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-4 md:grid-cols-4">
        <FilterInput
          label="Origin"
          icon={<MapPin size={17} />}
          value={filters.origin}
          onChange={(value) => updateFilter("origin", value)}
          placeholder="City or state"
        />

        <FilterInput
          label="Destination"
          icon={<MapPin size={17} />}
          value={filters.destination}
          onChange={(value) => updateFilter("destination", value)}
          placeholder="City or state"
        />

        <FilterInput
          label="Equipment"
          icon={<Truck size={17} />}
          value={filters.equipment}
          onChange={(value) => updateFilter("equipment", value)}
          placeholder="Dry Van, Reefer, Flatbed"
        />

        <FilterInput
          label="Min Rate"
          icon={<DollarSign size={17} />}
          value={filters.minRate}
          onChange={(value) => updateFilter("minRate", value)}
          placeholder="2000"
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto_auto]">
        <FilterInput
          label="Max Distance"
          icon={<Navigation size={17} />}
          value={filters.maxDistance}
          onChange={(value) => updateFilter("maxDistance", value)}
          placeholder="Any distance"
        />

        <FilterInput
          label="Load Type"
          icon={<Box size={17} />}
          value={filters.loadType}
          onChange={(value) => updateFilter("loadType", value)}
          placeholder="Full Truckload"
        />

        <button
          type="button"
          onClick={handleSearch}
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Search size={17} />
          Search Loads
        </button>

        <button
          type="button"
          onClick={clearFilters}
          className="mt-7 text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}

function FilterInput({
  label,
  icon,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-200">
        {label}
      </span>

      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-500/20">
        <span className="text-slate-500 dark:text-slate-400">{icon}</span>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </label>
  );
}