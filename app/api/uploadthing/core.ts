import { createUploadthing, type FileRouter } from "uploadthing/next";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

const f = createUploadthing();

export const ourFileRouter = {
  profileImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ file }) => {
    const session = await requireUser();

    if (!session.user?.email) {
      return;
    }

    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        image: file.url,
      },
    });

    return {
      url: file.url,
    };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;