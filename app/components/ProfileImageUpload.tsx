"use client";

import Image from "next/image";
import { UploadDropzone } from "@uploadthing/react";
import { toast } from "sonner";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

type ProfileImageUploadProps = {
  currentImage?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
};

export default function ProfileImageUpload({
  currentImage,
  firstName,
  lastName,
  role,
}: ProfileImageUploadProps) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`;

  return (
    <>
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-500 text-2xl font-semibold text-white">
        {currentImage ? (
          <Image
            src={currentImage}
            alt="Profile picture"
            fill
            className="object-cover"
          />
        ) : (
          initials
        )}
      </div>

      <div>
        <p className="font-semibold">
          {firstName} {lastName}
        </p>

        <p className="text-sm text-slate-500">{role}</p>

        <UploadDropzone<OurFileRouter, "profileImage">
          endpoint="profileImage"
          appearance={{
            container:
              "m-0 mt-3 flex h-auto min-h-0 w-fit border-none bg-transparent p-0",
            uploadIcon: "hidden",
            label:
              "m-0 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50",
            allowedContent: "hidden",
            button: "hidden",
          }}
          content={{
            label() {
              return "Change Photo";
            },
            allowedContent() {
              return "";
            },
          }}
          onClientUploadComplete={() => {
            toast.success("Profile picture updated!");
            window.location.reload();
          }}
          onUploadError={(error: Error) => {
            toast.error(error.message || "Failed to upload image.");
          }}
        />
      </div>
    </>
  );
}