"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle, KeyRound } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const missingLinkParams = !token || !email;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setSuccess("Your password has been reset. You can now sign in.");
      setTimeout(() => router.push("/sign-in"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <div className="w-full rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <Link
            href="/sign-in"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-zinc-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to sign in
          </Link>

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <KeyRound size={26} />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-zinc-900">
            Reset your password
          </h1>

          <p className="mt-3 leading-7 text-zinc-500">
            Choose a new password for your account.
          </p>

          {missingLinkParams ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              This reset link is invalid. Please request a new one from the{" "}
              <Link href="/forgot-password" className="underline">
                forgot password
              </Link>{" "}
              page.
            </div>
          ) : (
            <>
              {success && (
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                  <CheckCircle size={20} />
                  {success}
                </div>
              )}

              {error && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-zinc-800">
                    New password
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-zinc-800">
                    Confirm new password
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Resetting..." : "Reset password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
