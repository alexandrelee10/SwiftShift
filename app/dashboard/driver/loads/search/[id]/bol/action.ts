"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";

export async function saveBol(loadId: string, formData: FormData) {
  const session = await requireUser();

  if (!session.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

let document = await prisma.document.findFirst({
  where: {
    loadId,
    userId: user.id,
    type: "BILL_OF_LADING",
  },
});

if (!document) {
  const load = await prisma.load.findUnique({
    where: { id: loadId },
  });

  if (!load) {
    throw new Error("Load not found");
  }

  document = await prisma.document.create({
    data: {
      loadId,
      userId: user.id,
      type: "BILL_OF_LADING",
      fileName: `${load.referenceNumber}-bol`,
      fileUrl: null,
      status: "DRAFT",
    },
  });
}

  await prisma.billOfLading.upsert({
    where: {
      documentId: document.id,
    },
    update: {
      shipperName: String(formData.get("shipperName") || ""),
      shipperAddress: String(formData.get("shipperAddress") || ""),
      consigneeName: String(formData.get("consigneeName") || ""),
      consigneeAddress: String(formData.get("consigneeAddress") || ""),
      carrierName: String(formData.get("carrierName") || ""),
      trailerNumber: String(formData.get("trailerNumber") || ""),
      sealNumber: String(formData.get("sealNumber") || ""),
      commodity: String(formData.get("commodity") || ""),
      weight: Number(formData.get("weight") || 0),
      pieces: Number(formData.get("pieces") || 0),
    },
    create: {
      documentId: document.id,
      shipperName: String(formData.get("shipperName") || ""),
      shipperAddress: String(formData.get("shipperAddress") || ""),
      consigneeName: String(formData.get("consigneeName") || ""),
      consigneeAddress: String(formData.get("consigneeAddress") || ""),
      carrierName: String(formData.get("carrierName") || ""),
      trailerNumber: String(formData.get("trailerNumber") || ""),
      sealNumber: String(formData.get("sealNumber") || ""),
      commodity: String(formData.get("commodity") || ""),
      weight: Number(formData.get("weight") || 0),
      pieces: Number(formData.get("pieces") || 0),
    },
  });

  await prisma.document.update({
    where: {
      id: document.id,
    },
    data: {
      status: "COMPLETED",
    },
  });

  redirect(`/dashboard/loads/search/${loadId}`);
}