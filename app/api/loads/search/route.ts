import { NextResponse } from "next/server";
import { LoadStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { origin, destination, weight, equipmentType, pickupDate } = body;

    const where = {
      status: LoadStatus.POSTED,
      AND: [] as any[],
    };

    if (origin) {
      where.AND.push({
        OR: [
          {
            originCity: {
              contains: origin,
              mode: "insensitive",
            },
          },
          {
            originState: {
              contains: origin,
              mode: "insensitive",
            },
          },
        ],
      });
    }

    if (destination) {
      where.AND.push({
        OR: [
          {
            destinationCity: {
              contains: destination,
              mode: "insensitive",
            },
          },
          {
            destinationState: {
              contains: destination,
              mode: "insensitive",
            },
          },
        ],
      });
    }

    if (weight) {
      where.AND.push({
        weight: {
          lte: Number(weight),
        },
      });
    }

    if (equipmentType) {
      where.AND.push({
        equipmentType: {
          contains: equipmentType,
          mode: "insensitive",
        },
      });
    }

    if (pickupDate) {
      const start = new Date(pickupDate);
      const end = new Date(pickupDate);
      end.setHours(23, 59, 59, 999);

      where.AND.push({
        pickupDate: {
          gte: start,
          lte: end,
        },
      });
    }

    const loads = await prisma.load.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: 25,
      include: {
        broker: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const safeLoads = loads.map((load) => ({
      ...load,
      rate: load.rate.toString(),
    }));

    return NextResponse.json({ loads: safeLoads });
  } catch (error) {
    console.error("LOAD_SEARCH_ERROR", error);

    return NextResponse.json(
      { message: "Something went wrong while searching loads." },
      { status: 500 }
    );
  }
}