"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Truck, BriefcaseBusiness, Radio } from "lucide-react";

import DarkLogo from "@/public/assets/main-logo/logoDark.svg";
import { getSession } from "next-auth/react";

const roles = [
  {
    value: "DRIVER",
    title: "Driver",
    description: "Search and book freight loads.",
    icon: Truck,
  },
  {
    value: "BROKER",
    title: "Broker",
    description: "Post and manage available freight.",
    icon: BriefcaseBusiness,
  },
];

const SignUpForm = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNum: "",
    email: "",
    password: "",
    role: "DRIVER",
  });

  const [fieldErrors, setFieldErrors] = useState<{
    [key: string]: string;
  }>({});

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

  const selectRole = (role: string) => {
    setForm((prev) => ({
      ...prev,
      role,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      role: "",
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
                className="rounded-xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/15"
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
              Get started
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Choose how you’ll use SwiftShift and fill in your details.
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* ROLE SELECTION */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-zinc-800">
                I am signing up as
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const active = form.role === role.value;

                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => selectRole(role.value)}
                      className={`rounded-2xl border p-5 text-center transition ${
                        active
                          ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100"
                          : "border-zinc-200 bg-white hover:border-blue-200 hover:bg-zinc-50"
                      }`}
                    >
                      <div
                        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
                          active
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        <Icon size={22} />
                      </div>

                      <p className="mt-4 font-bold text-zinc-900">
                        {role.title}
                      </p>

                      <p className="mt-1 text-sm leading-5 text-zinc-500">
                        {role.description}
                      </p>

                      <div
                        className={`mx-auto mt-4 h-4 w-4 rounded-full border ${
                          active
                            ? "border-blue-600 bg-blue-600"
                            : "border-zinc-300 bg-white"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {fieldErrors.role && (
                <p className="mt-2 text-sm text-red-500">{fieldErrors.role}</p>
              )}
            </div>

            {/* NAME */}
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

            {/* EMAIL */}
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
                <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            {/* PHONE */}
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

            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Password
              </label>

              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="Create a strong password"
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
              Create Account
            </button>
          </form>

          {/* DIVIDER */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />

            <p className="whitespace-nowrap text-sm text-zinc-500">
              Already have an account?
            </p>

            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          {/* SIGN IN */}
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
