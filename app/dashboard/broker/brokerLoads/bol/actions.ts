"use server";

import { requireUser } from "@/lib/requireUser";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// Save BOL fields and auto-move to Complete when all fields are filled
// ─────────────────────────────────────────────────────────────────────────────
export async function saveBolFields(formData: FormData) {
  await requireUser();

  const documentId      = formData.get("documentId") as string;
  const shipperName     = (formData.get("shipperName") as string)?.trim();
  const shipperAddress  = (formData.get("shipperAddress") as string)?.trim();
  const consigneeName   = (formData.get("consigneeName") as string)?.trim();
  const consigneeAddress = (formData.get("consigneeAddress") as string)?.trim();
  const carrierName     = (formData.get("carrierName") as string)?.trim() || null;
  const trailerNumber   = (formData.get("trailerNumber") as string)?.trim() || null;
  const sealNumber      = (formData.get("sealNumber") as string)?.trim() || null;
  const commodity       = (formData.get("commodity") as string)?.trim() || null;
  const weightRaw       = (formData.get("weight") as string)?.trim();
  const piecesRaw       = (formData.get("pieces") as string)?.trim();
  const weight          = weightRaw ? parseFloat(weightRaw) : null;
  const pieces          = piecesRaw ? parseInt(piecesRaw, 10) : null;

  if (!documentId) throw new Error("Missing documentId");
  if (!shipperName) throw new Error("Shipper name is required");
  if (!shipperAddress) throw new Error("Shipper address is required");
  if (!consigneeName) throw new Error("Consignee name is required");
  if (!consigneeAddress) throw new Error("Consignee address is required");

  // Upsert BillOfLading — create on first save, update on subsequent saves
  await prisma.billOfLading.upsert({
    where: { documentId },
    create: {
      documentId,
      shipperName,
      shipperAddress,
      consigneeName,
      consigneeAddress,
      carrierName,
      trailerNumber,
      sealNumber,
      commodity,
      weight,
      pieces,
    },
    update: {
      shipperName,
      shipperAddress,
      consigneeName,
      consigneeAddress,
      carrierName,
      trailerNumber,
      sealNumber,
      commodity,
      weight,
      pieces,
    },
  });

  // All 10 fields must be present to be considered complete
  const allFilled =
    !!shipperName &&
    !!shipperAddress &&
    !!consigneeName &&
    !!consigneeAddress &&
    !!carrierName &&
    !!trailerNumber &&
    !!sealNumber &&
    !!commodity &&
    !!weight &&
    !!pieces;

  const newStatus = allFilled ? "COMPLETE" : "DRAFT";

  await prisma.document.update({
    where: { id: documentId },
    data: { status: newStatus },
  });

  revalidatePath("/dashboard/broker/brokerLoads/bol");

  // redirect() must be called outside try/catch — it throws internally in Next.js
  if (allFilled) {
    redirect("/dashboard/broker/brokerLoads/bol?tab=complete");
  } else {
    redirect("/dashboard/broker/brokerLoads/bol");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Manually mark a BOL complete
// ─────────────────────────────────────────────────────────────────────────────
export async function markBolComplete(documentId: string) {
  await requireUser();

  await prisma.document.update({
    where: { id: documentId },
    data: { status: "COMPLETE" },
  });

  revalidatePath("/dashboard/broker/brokerLoads/bol");
}

// ─────────────────────────────────────────────────────────────────────────────
// Create a new BOL Document for a load (call from load detail page)
// ─────────────────────────────────────────────────────────────────────────────
export async function createBolForLoad(loadId: string) {
  const session = await requireUser();
  if (!session.user?.email) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!dbUser) throw new Error("User not found");

  const load = await prisma.load.findUnique({ where: { id: loadId } });
  if (!load) throw new Error("Load not found");

  // Return existing BOL doc if one already exists for this load
  const existing = await prisma.document.findFirst({
    where: { loadId, type: "BILL_OF_LADING" },
  });
  if (existing) {
    redirect(`/dashboard/broker/brokerLoads/bol/${existing.id}`);
  }

  const doc = await prisma.document.create({
    data: {
      loadId,
      userId: dbUser.id,
      type: "BILL_OF_LADING",
      fileName: `BOL - ${load.referenceNumber}`,
      status: "DRAFT",
    },
  });

  revalidatePath("/dashboard/broker/brokerLoads/bol");
  redirect(`/dashboard/broker/brokerLoads/bol/${doc.id}`);
}