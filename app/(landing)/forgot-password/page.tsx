"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setSuccess("Password reset email sent successfully.");
      setEmail("");
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

          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
              <CheckCircle size={20} />
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <ShieldCheck size={26} />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-zinc-900">
            Forgot password?
          </h1>

          <p className="mt-3 leading-7 text-zinc-500">
            Enter your email address and we&apos;ll send you instructions to
            reset your password.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-800">
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <Mail size={20} className="text-zinc-400" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Remember your password?{" "}
            <Link href="/sign-in" className="font-bold text-blue-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}