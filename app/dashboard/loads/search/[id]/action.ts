"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { BookingStatus, LoadStatus } from "@prisma/client";
import { redirect } from "next/navigation";

export async function bookLoad(loadId: string) {
  // 1. Get the logged-in user
  const session = await requireUser();

  if (!session.user?.email) {
    throw new Error("Unauthorized");
  }

  // 2. Find that user in your database
  const driver = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!driver) {
    throw new Error("Driver not found");
  }

  // 3. Find the load they are trying to book
  const load = await prisma.load.findUnique({
    where: {
      id: loadId,
    },
  });

  if (!load) {
    throw new Error("Load not found");
  }

  // 4. Make sure the load is still available
  if (load.status !== LoadStatus.POSTED) {
    throw new Error("This load is no longer available.");
  }

  // 5. Prevent the same driver from booking the same load twice
  const existingBooking = await prisma.booking.findFirst({
    where: {
      loadId: load.id,
      driverId: driver.id,
    },
  });

  if (existingBooking) {
    throw new Error("You already booked this load.");
  }

  // 6. Create the booking AND update the load status together
  await prisma.$transaction([
    prisma.booking.create({
      data: {
        loadId: load.id,
        driverId: driver.id,
        status: BookingStatus.CONFIRMED,
      },
    }),

    prisma.load.update({
      where: {
        id: load.id,
      },
      data: {
        status: LoadStatus.BOOKED,
      },
    }),
  ]);

  // 7. Send user to My Loads
  redirect("/dashboard/loads/myloads?status=BOOKED");
}