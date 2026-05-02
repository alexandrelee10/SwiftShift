"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { revalidatePath } from "next/cache";

// For Account Preferences
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

export async function downloadUserData() {
  const session = await requireUser();

  if (!session.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      preferences: true,
      bookings: true,
      driverTrips: true,
    },
  });

  if (!user) throw new Error("User not found");

  const data = JSON.stringify(user, null, 2);

  return data;
}

export async function deleteAccount() {
  const session = await requireUser();

  if (!session.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  // delete in order to avoid FK issues
  await prisma.$transaction([
    prisma.userPreference.deleteMany({ where: { userId: user.id } }),
    prisma.booking.deleteMany({ where: { driverId: user.id } }),
    prisma.trip.deleteMany({ where: { driverId: user.id } }),
    prisma.document.deleteMany({ where: { userId: user.id } }),
    prisma.user.delete({ where: { id: user.id } }),
  ]);
}