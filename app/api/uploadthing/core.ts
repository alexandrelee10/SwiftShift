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
  })
    .middleware(async () => {
      const session = await requireUser();

      if (!session.user?.email) {
        throw new Error("Unauthorized");
      }

      return {
        email: session.user.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.user.update({
        where: {
          email: metadata.email,
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