import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const load = await prisma.load.findUnique({
    where: { id },
    include: {
      broker: true,
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