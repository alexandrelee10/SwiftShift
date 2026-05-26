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

  const bolDocuments = await prisma.document.findMany({
    where: {
      userId: dbUser.id,
      type: "BILL_OF_LADING",
    },
    include: {
      load: true,
      billOfLading: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const podDocuments = await prisma.document.findMany({
    where: {
      userId: dbUser.id,
      type: "PROOF_OF_DELIVERY",
    },
    include: {
      load: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    bols: bolDocuments,
    pods: podDocuments,
  };
}