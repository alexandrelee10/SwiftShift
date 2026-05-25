"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import DarkLogo from "@/public/assets/main-logo/logoDark.svg";

const SignInForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [serverMessage, setServerMessage] = useState("");
  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerMessage("");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setServerMessage("Invalid email or password");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="grid min-h-screen bg-white md:grid-cols-2">
      {/* LEFT */}
      <div className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-700 to-blue-600 p-12 text-white md:flex">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative max-w-md text-center">
          <div className="mx-auto mb-8 flex justify-center">
            <Image
              src={DarkLogo}
              alt="SwiftShift logo"
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-5xl font-black leading-tight tracking-tight">
            Move freight forward with{" "}
            <span className="text-blue-200">confidence.</span>
          </h2>

          <p className="mt-6 text-base leading-7 text-blue-100">
            SwiftShift provides smarter freight tools for drivers, brokers, and
            dispatch teams.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3 text-left">
            {["Live Loads", "Fast Booking", "Real Tracking"].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-sm"
              >
                <p className="text-sm font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6 py-10 sm:px-10 md:px-14">
        <div className="w-full max-w-xl">
          {/* BACK */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            ← Back to Home
          </Link>

          {/* MOBILE LOGO */}
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <Image
              src={DarkLogo}
              alt="SwiftShift logo"
              className="h-auto w-10 object-contain"
              priority
            />

            <p className="text-lg font-bold text-zinc-900">SwiftShift</p>
          </div>

          {/* HEADER */}
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
              Welcome back
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              Sign in to your account
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Enter your email and password to continue.
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Email
              </label>

              <input
                type="email"
                value={form.email}
                name="email"
                onChange={onChange}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-zinc-700">
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                type="password"
                value={form.password}
                name="password"
                onChange={onChange}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-700 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>

            {/* SERVER MESSAGE */}
            {serverMessage && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-600">
                  {serverMessage}
                </p>
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full rounded-xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Sign In
            </button>
          </form>

          {/* DIVIDER */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />

            <p className="whitespace-nowrap text-sm text-zinc-500">
              New to SwiftShift?
            </p>

            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          {/* SIGN UP */}
          <Link
            href="/sign-up"
            className="block w-full rounded-xl border border-zinc-300 bg-white py-3.5 text-center text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;