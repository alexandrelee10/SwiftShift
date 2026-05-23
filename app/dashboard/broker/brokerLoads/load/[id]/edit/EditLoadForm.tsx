"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type LoadFormData = {
  referenceNumber: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  equipmentType: string;
  weight: string;
  commodity: string;
  rate: string;
  distanceMiles: string;
  pickupDate: string;
  deliveryDate: string;
  notes: string;
};

export default function EditLoadForm({
  loadId,
  initialData,
}: {
  loadId: string;
  initialData: LoadFormData;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(initialData);

  function updateField(name: keyof LoadFormData, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  startTransition(async () => {
    const res = await fetch(`/api/loads/${loadId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      toast.error("Could not update load");
      return;
    }

    toast.success("Load updated");

    router.push("/dashboard/broker/brokerLoads/load");

    router.refresh();
  });
}

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Reference #" value={form.referenceNumber} onChange={(v) => updateField("referenceNumber", v)} />
        <Input label="Equipment" value={form.equipmentType} onChange={(v) => updateField("equipmentType", v)} />
        <Input label="Origin City" value={form.originCity} onChange={(v) => updateField("originCity", v)} />
        <Input label="Origin State" value={form.originState} onChange={(v) => updateField("originState", v)} />
        <Input label="Destination City" value={form.destinationCity} onChange={(v) => updateField("destinationCity", v)} />
        <Input label="Destination State" value={form.destinationState} onChange={(v) => updateField("destinationState", v)} />
        <Input label="Weight" value={form.weight} onChange={(v) => updateField("weight", v)} />
        <Input label="Rate" value={form.rate} onChange={(v) => updateField("rate", v)} />
        <Input label="Distance Miles" value={form.distanceMiles} onChange={(v) => updateField("distanceMiles", v)} />
        <Input label="Commodity" value={form.commodity} onChange={(v) => updateField("commodity", v)} />
        <Input label="Pickup Date" type="datetime-local" value={form.pickupDate} onChange={(v) => updateField("pickupDate", v)} />
        <Input label="Delivery Date" type="datetime-local" value={form.deliveryDate} onChange={(v) => updateField("deliveryDate", v)} />
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          className="mt-2 min-h-28 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
      />
    </div>
  );
}