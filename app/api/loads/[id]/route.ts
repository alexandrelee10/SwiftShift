import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const load = await prisma.load.findUnique({
    where: { id },
    include: {
      broker: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (!load) {
    return NextResponse.json(
      { error: "Load not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(load);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string}> }
) {
  const session = await requireUser();

  if (session.user.role !== "BROKER") {
    return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const existingLoad = await prisma.load.findUnique({
    where: { id }
  });

  if(!existingLoad) {
    return NextResponse.json({ error: "Load not found" }, { status: 404 });
  }

  if (existingLoad.brokerId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const updatedLoad = await prisma.load.update({
    where: { id },
    data: {
      referenceNumber: body.referenceNumber,
      originAddress: body.originAddress,
      originCity: body.originCity,
      originState: body.originState,
      destinationAddress: body.destinationAddress,
      destinationCity: body.destinationCity,
      destinationState: body.destinationState,
      equipmentType: body.equipmentType,

      commodity: body.commodity || null,
      notes: body.notes || null,

      weight: body.weight ? Number(body.weight) : null,
      rate: body.rate ? Number(body.rate) : existingLoad.rate,
      distanceMiles: body.distanceMiles ? Number(body.distanceMiles) : null,

      pickupDate: body.pickupDate ? new Date(body.pickupDate) : existingLoad.pickupDate,
      deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null
    }
  });
  return NextResponse.json(updatedLoad);
}

// Delete 
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireUser();

  if (session.user.role !== "BROKER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const load = await prisma.load.findUnique({
    where: { id },
  });

  if (!load) {
    return NextResponse.json({ error: "Load not found" }, { status: 404 });
  }

  if (load.brokerId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const cancelledLoad = await prisma.load.update({
    where: { id },
    data: {
      status: "CANCELLED",
    },
  });

  return NextResponse.json(cancelledLoad);
}