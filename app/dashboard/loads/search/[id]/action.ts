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

await prisma.$transaction([
  // 1. Create booking
  prisma.booking.create({
    data: {
      loadId: load.id,
      driverId: driver.id,
      status: BookingStatus.CONFIRMED,
    },
  }),

  // 2. Update load status
  prisma.load.update({
    where: {
      id: load.id,
    },
    data: {
      status: LoadStatus.BOOKED,
    },
  }),

  // 3. Create documents for this load
  prisma.document.createMany({
    data: [
      {
        loadId: load.id,
        userId: driver.id,
        type: "BILL_OF_LADING",
        fileName: `${load.referenceNumber}-bol`,
        fileUrl: null,
        status: "DRAFT",
      },
      {
        loadId: load.id,
        userId: driver.id,
        type: "RATE_CONFIRMATION",
        fileName: `${load.referenceNumber}-rate-confirmation`,
        fileUrl: null,
        status: "PENDING",
      },
      {
        loadId: load.id,
        userId: driver.id,
        type: "PROOF_OF_DELIVERY",
        fileName: `${load.referenceNumber}-pod`,
        fileUrl: null,
        status: "REQUIRED",
      },
      {
        loadId: load.id,
        userId: driver.id,
        type: "INVOICE",
        fileName: `${load.referenceNumber}-invoice`,
        fileUrl: null,
        status: "NOT_STARTED",
      },
    ],
  }),
]);

  // 7. Send user to My Loads
  redirect("/dashboard/loads/myloads?status=BOOKED");
}