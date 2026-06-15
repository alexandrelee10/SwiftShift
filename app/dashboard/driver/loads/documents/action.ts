import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

export async function getDriverDocuments() {
  const session = await requireUser();

  if (!session.user?.email) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) throw new Error("User not found");
  if (dbUser.role !== "DRIVER") throw new Error("Forbidden");

  const documents = await prisma.document.findMany({
    where: {
      load: {
        OR: [
          {
            bookings: {
              some: {
                driverId: dbUser.id,
              },
            },
          },
          {
            trips: {
              some: {
                driverId: dbUser.id,
              },
            },
          },
        ],
      },
    },
    include: {
      load: true,
      billOfLading: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    bols: documents.filter((doc) => doc.type === "BILL_OF_LADING"),
    pods: documents.filter((doc) => doc.type === "PROOF_OF_DELIVERY"),
  };
}