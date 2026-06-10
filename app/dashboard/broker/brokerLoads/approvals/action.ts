"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function approveLoadRequest(bookingId: string) {
  const session = await requireUser();

  if (!session.user?.email) {
    redirect("/dashboard/broker/brokerLoads/approvals?error=Unauthorized");
  }

  const broker = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!broker || broker.role !== "BROKER") {
    redirect("/dashboard/broker/brokerLoads/approvals?error=Unauthorized");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      load: true,
    },
  });

  if (!booking) {
    redirect("/dashboard/broker/brokerLoads/approvals?error=Request not found");
  }

  if (booking.load.brokerId !== broker.id) {
    redirect("/dashboard/broker/brokerLoads/approvals?error=You do not own this load");
  }

  await prisma.$transaction([
    prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "APPROVED",
      },
    }),

    prisma.load.update({
      where: { id: booking.loadId },
      data: {
        status: "BOOKED",
      },
    }),
  ]);

  revalidatePath("/dashboard/broker/brokerLoads/approvals");

  redirect("/dashboard/broker/brokerLoads/approvals?success=Request approved");
}

export async function rejectLoadRequest(bookingId: string) {
  const session = await requireUser();

  if (!session.user?.email) {
    redirect("/dashboard/broker/brokerLoads/approvals?error=Unauthorized");
  }

  const broker = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!broker || broker.role !== "BROKER") {
    redirect("/dashboard/broker/brokerLoads/approvals?error=Unauthorized");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      load: true,
    },
  });

  if (!booking) {
    redirect("/dashboard/broker/brokerLoads/approvals?error=Request not found");
  }

  if (booking.load.brokerId !== broker.id) {
    redirect("/dashboard/broker/brokerLoads/approvals?error=You do not own this load");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "REJECTED",
    },
  });

  revalidatePath("/dashboard/broker/brokerLoads/approvals");

  redirect("/dashboard/broker/brokerLoads/approvals?success=Request rejected");
}