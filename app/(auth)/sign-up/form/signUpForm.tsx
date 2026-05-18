"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import DarkLogo from "@/public/assets/main-logo/logoDark.svg"

const SignUpForm = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNum: "",
    email: "",
    password: "",
    role: "",
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [serverMessage, setServerMessage] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setServerMessage("");

    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    let data;

    try {
      data = await res.json();
    } catch {
      data = { message: "Something went wrong" };
    }

    if (!res.ok) {
      setServerMessage(data.message || "Something went wrong");

      if (data.fields) {
        const flattenedErrors: { [key: string]: string } = {};

        Object.entries(data.fields).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            flattenedErrors[key] = value[0] as string;
          } else if (typeof value === "string") {
            flattenedErrors[key] = value;
          }
        });

        setFieldErrors(flattenedErrors);
      }

      return;
    }

    router.push("/sign-in");
  };

  return (
    <div className="grid min-h-screen bg-white md:grid-cols-2">
      {/* LEFT */}
      <div className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 p-12 text-white md:flex">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative max-w-md text-center">
          <div className="mx-auto mb-8 flex justify-center">
            <Image
              src={DarkLogo}
              alt="SwiftShift logo"
              className="object-contain"
              priority
            />
          </div>

          <p className="mt-4 text-base leading-7 text-blue-100">
            Create your account and start moving freight with smarter tools built
            for modern carriers.
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

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6 py-10 sm:px-10 md:px-14">
        <div className="w-full max-w-md">
          {/* Back button */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
          >
            ← Back to Home
          </Link>

          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <Image
              src={DarkLogo}
              alt="SwiftShift logo"
              className="h-auto w-10 object-contain"
              priority
            />

            <p className="text-lg font-bold text-zinc-900">SwiftShift</p>
          </div>

          {/* Top */}
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
              Get started
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Enter your details below to create your SwiftShift account.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  First Name
                </label>

                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={onChange}
                  placeholder="John"
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-zinc-700 shadow-sm outline-none transition placeholder:text-zinc-400 focus:ring-4 ${
                    fieldErrors.firstName
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-zinc-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  required
                />

                {fieldErrors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Last Name
                </label>

                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={onChange}
                  placeholder="Doe"
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-zinc-700 shadow-sm outline-none transition placeholder:text-zinc-400 focus:ring-4 ${
                    fieldErrors.lastName
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-zinc-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  required
                />

                {fieldErrors.lastName && (
                  <p className="mt-1 text-sm text-red-500">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Email
              </label>

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="johndoe@swiftshift.com"
                className={`w-full rounded-xl border bg-white px-4 py-3 text-zinc-700 shadow-sm outline-none transition placeholder:text-zinc-400 focus:ring-4 ${
                  fieldErrors.email
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : "border-zinc-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
                required
              />

              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Phone Number
              </label>

              <input
                name="phoneNum"
                value={form.phoneNum}
                onChange={onChange}
                placeholder="(123) 456-7890"
                className={`w-full rounded-xl border bg-white px-4 py-3 text-zinc-700 shadow-sm outline-none transition placeholder:text-zinc-400 focus:ring-4 ${
                  fieldErrors.phoneNum
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : "border-zinc-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
                required
              />

              {fieldErrors.phoneNum && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.phoneNum}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Password
              </label>

              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="Create a password"
                className={`w-full rounded-xl border bg-white px-4 py-3 text-zinc-700 shadow-sm outline-none transition placeholder:text-zinc-400 focus:ring-4 ${
                  fieldErrors.password
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : "border-zinc-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
                required
              />

              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.password}
                </p>
              )}
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
              Create Account
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200"></div>

            <p className="whitespace-nowrap text-sm text-zinc-500">
              Already have an account?
            </p>

            <div className="h-px flex-1 bg-zinc-200"></div>
          </div>

          <Link
            href="/sign-in"
            className="block w-full rounded-xl border border-zinc-300 bg-white py-3.5 text-center text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;