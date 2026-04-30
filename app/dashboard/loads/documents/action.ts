"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { revalidatePath } from "next/cache";

export async function deleteDocument(documentId: string) {
  const session = await requireUser();

  if (!session.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });

  if (!document) {
    throw new Error("Document not found");
  }

  if (document.userId !== user.id) {
    throw new Error("Not allowed");
  }

  await prisma.$transaction([
    prisma.billOfLading.deleteMany({
      where: {
        documentId,
      },
    }),

    prisma.document.delete({
      where: {
        id: documentId,
      },
    }),
  ]);

  revalidatePath("/dashboard/loads/documents");
}