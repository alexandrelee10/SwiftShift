"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { revalidatePath } from "next/cache";

export async function updatePreferences(formData: FormData) {
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

  await prisma.userPreference.upsert({
    where: {
      userId: user.id,
    },
    update: {
      language: String(formData.get("language")),
      timeZone: String(formData.get("timeZone")),
      dateFormat: String(formData.get("dateFormat")),
      currency: String(formData.get("currency")),
    },
    create: {
      userId: user.id,
      language: String(formData.get("language")),
      timeZone: String(formData.get("timeZone")),
      dateFormat: String(formData.get("dateFormat")),
      currency: String(formData.get("currency")),
    },
  });

  revalidatePath("/dashboard/loads/settings");
}