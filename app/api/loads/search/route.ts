import { NextResponse } from "next/server";
import { LoadStatus } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { origin, destination, weight, equipmentType, pickupDate } = body;

    const andFilters: any[] = [];

    if (origin?.trim()) {
      andFilters.push({
        OR: [
          {
            originCity: {
              contains: origin.trim(),
              mode: "insensitive",
            },
          },
          {
            originState: {
              contains: origin.trim(),
              mode: "insensitive",
            },
          },
        ],
      });
    }

    if (destination?.trim()) {
      andFilters.push({
        OR: [
          {
            destinationCity: {
              contains: destination.trim(),
              mode: "insensitive",
            },
          },
          {
            destinationState: {
              contains: destination.trim(),
              mode: "insensitive",
            },
          },
        ],
      });
    }

    if (weight?.trim()) {
      andFilters.push({
        weight: {
          lte: Number(weight),
        },
      });
    }

    if (equipmentType?.trim()) {
      andFilters.push({
        equipmentType: {
          contains: equipmentType.trim(),
          mode: "insensitive",
        },
      });
    }

    if (pickupDate?.trim()) {
      const start = new Date(pickupDate);
      const end = new Date(pickupDate);
      end.setHours(23, 59, 59, 999);

      andFilters.push({
        pickupDate: {
          gte: start,
          lte: end,
        },
      });
    }

    const loads = await prisma.load.findMany({
      where: {
        status: LoadStatus.POSTED,
        ...(andFilters.length ? { AND: andFilters } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        broker: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      loads: loads.map((load) => ({
        ...load,
        rate: load.rate.toString(),
      })),
    });
  } catch (error) {
    console.error("LOAD_SEARCH_ERROR", error);

    return NextResponse.json(
      { message: "Something went wrong while searching loads." },
      { status: 500 }
    );
  }
}