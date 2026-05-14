import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "SwiftShift",
  description: "Modern load board platform",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body
        className={`${inter.className} flex min-h-full flex-col`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}