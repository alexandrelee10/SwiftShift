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

    router.push(`/dashboard/loads/search?${params.toString()}`);
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

    router.push("/dashboard/loads/search");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Search size={17} />
          Search Loads
        </button>

        <button
          type="button"
          onClick={clearFilters}
          className="mt-7 text-sm font-medium text-blue-600 hover:text-blue-700"
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
      <span className="mb-2 block text-sm font-medium text-slate-900">
        {label}
      </span>

      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
        <span className="text-slate-500">{icon}</span>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
        />

        {value && (
          <button type="button" onClick={() => onChange("")}>
            <X size={16} className="text-slate-400" />
          </button>
        )}
      </div>
    </label>
  );
}