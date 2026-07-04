"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { revalidatePath } from "next/cache";

export async function requestLoad(loadId: string) {
  const session = await requireUser();

  if (!session.user.email || session.user.role !== "DRIVER") {
    throw new Error("Unauthorized");
  }

  const driver = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!driver) {
    throw new Error("Driver not found");
  }

  const load = await prisma.load.findUnique({
    where: { id: loadId },
  });

  if (!load) {
    throw new Error("Load not found");
  }

  if (load.status !== "POSTED") {
    throw new Error("This load is no longer available");
  }

  const existingRequest = await prisma.booking.findFirst({
    where: {
      loadId,
      driverId: driver.id,
    },
  });

  if (existingRequest) {
    throw new Error("You already requested this load");
  }

  await prisma.booking.create({
    data: {
      driverId: driver.id,
      loadId,
      status: "PENDING",
    },
  });

  revalidatePath("/dashboard/driver/loads/search");
  revalidatePath("/dashboard/driver/loads/myloads");
}
