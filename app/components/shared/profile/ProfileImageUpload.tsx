"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useUploadThing } from "@/lib/uploadthing";

type Props = {
  image?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
};

export default function ProfilePhotoChanger({
  image,
  firstName,
  lastName,
  role,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(image ?? null);
  const { update } = useSession();

  const { startUpload, isUploading } = useUploadThing("profileImage", {
    onClientUploadComplete: async (res) => {
      const uploadedUrl = res?.[0]?.url;

      if (uploadedUrl) {
        setPreview(uploadedUrl);
        await update();
      }
    },
    onUploadError: (error) => {
      alert(error.message);
    },
  });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    await startUpload([file]);
  }

  return (
    <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-blue-500 text-2xl font-semibold text-white">
        {preview ? (
          <Image
            src={preview}
            alt="Profile photo"
            fill
            className="object-cover"
          />
        ) : (
          <>
            {firstName?.[0]}
            {lastName?.[0]}
          </>
        )}
      </div>

      <div>
        <p className="font-semibold">
          {firstName} {lastName}
        </p>
        <p className="text-sm text-slate-500">{role}</p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="mt-3 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white dark:border-none"
        >
          {isUploading ? "Uploading..." : "Change Photo"}
        </button>
      </div>
    </div>
  );
}