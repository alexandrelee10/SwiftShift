"use server"
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { LoadStatus } from "@prisma/client";
import { redirect } from "next/navigation";

export async function startTrip(loadId: string) {
    const session = await requireUser();

    if (!session.user?.email) {
        throw new Error("Unauthorized");
    }

    const driver = await prisma.user?.findUnique({
        where: {
            email: session.user.email,
        },
    });

    if (!driver) {
        throw new Error("Driver not found")
    }

    const booking= await prisma.booking.findFirst({
        where: {
            loadId,
            driverId: driver.id,
        },
    });

    if (!booking) {
        throw new Error("No booking found");
    }

    await prisma.load.update({
        where: {
            id: loadId,
        },
        data: {
            status: LoadStatus.IN_TRANSIT,
        },
    });

    redirect("/dashboard")

    
}

export async function markDelivered(loadId: string) {
  const session = await requireUser();

  if (!session.user?.email) {
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

  const booking = await prisma.booking.findFirst({
    where: {
      loadId,
      driverId: driver.id,
    },
  });

  if (!booking) {
    throw new Error("You have not booked this load.");
  }

  await prisma.load.update({
    where: {
      id: loadId,
    },
    data: {
      status: LoadStatus.DELIVERED,
    },
  });

  redirect("/dashboard/loads/myloads?status=DELIVERED");
}