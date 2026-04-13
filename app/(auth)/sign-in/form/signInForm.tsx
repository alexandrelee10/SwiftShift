"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import mini_logo from "@/public/assets/main-logo/mini-logo.svg";
import Link from "next/link";

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
    <div className="min-h-screen grid md:grid-cols-2 bg-white">
      {/* LEFT */}
      <div className="hidden md:flex relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white items-center justify-center p-12">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative max-w-md text-center">
          <div className="mx-auto mb-8 flex justify-center">
            <div className="mx-auto mb-8 flex justify-center">
              <Image
                src={mini_logo}
                alt="SwiftShift logo"
                className="w-28 h-auto object-contain"
                priority
              />
            </div>
          </div>

          <h2 className="text-4xl font-bold tracking-tight">SwiftShift</h2>
          <p className="mt-4 text-base leading-7 text-blue-100">
            Move freight faster with smarter tools built for modern carriers.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3 text-left">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/15">
              <p className="text-sm font-semibold">Live Loads</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/15">
              <p className="text-sm font-semibold">Fast Booking</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/15">
              <p className="text-sm font-semibold">Real Tracking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-10 md:px-14">
        <div className="w-full max-w-md">
          <div className="mb-8 md:hidden flex items-center gap-3">
            <Image
              src={mini_logo}
              alt="SwiftShift logo"
              className="w-10 h-auto object-contain"
              priority
            />
          </div>

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

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-700 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-zinc-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
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
              />
            </div>

            {serverMessage && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-600">
                  {serverMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Sign In
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200"></div>
            <p className="whitespace-nowrap text-sm text-zinc-500">
              New to SwiftShift?
            </p>
            <div className="h-px flex-1 bg-zinc-200"></div>
          </div>

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