"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { BookingStatus, LoadStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

type BookLoadResult = {
  success: boolean;
  message: string;
};

export async function bookLoad(loadId: string): Promise<BookLoadResult> {
  try {
    const session = await requireUser();

    if (!session.user?.email) {
      return {
        success: false,
        message: "Unauthorized.",
      };
    }

    const driver = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!driver) {
      return {
        success: false,
        message: "Driver not found.",
      };
    }

    const load = await prisma.load.findUnique({
      where: {
        id: loadId,
      },
    });

    if (!load) {
      return {
        success: false,
        message: "Load not found.",
      };
    }

    if (load.status !== LoadStatus.POSTED) {
      return {
        success: false,
        message: "This load is no longer available.",
      };
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        loadId: load.id,
        driverId: driver.id,
      },
    });

    if (existingBooking) {
      return {
        success: false,
        message: "You already booked this load.",
      };
    }

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

    revalidatePath("/dashboard/loads/search");
    revalidatePath("/dashboard/loads/myloads");

    return {
      success: true,
      message: "Load booked successfully!",
    };
  } catch (error) {
    console.error("BOOK_LOAD_ERROR:", error);

    return {
      success: false,
      message: "Failed to book load.",
    };
  }
}


export async function requestLoad(loadId: string) {
  const session = await requireUser();

  if (
    !session.user.email ||
    session.user.role !== "DRIVER"
  ) {
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

  const existingRequest =
    await prisma.booking.findFirst({
      where: {
        loadId,
        driverId: driver.id,
      },
    });

  if (existingRequest) {
    throw new Error(
      "You already requested this load"
    );
  }

  await prisma.booking.create({
    data: {
      driverId: driver.id,
      loadId,
      status: "PENDING",
    },
  });

  revalidatePath(
    "/dashboard/driver/loads/search"
  );
}