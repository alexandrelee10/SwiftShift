"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Truck, BriefcaseBusiness, Loader2 } from "lucide-react";

import DarkLogo from "@/public/assets/main-logo/logoDark.svg";

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

type SignUpFormData = {
  firstName: string;
  lastName: string;
  phoneNum: string;
  email: string;
  password: string;
  role: "DRIVER" | "BROKER" | "DISPATCH";
};

type FieldErrors = Partial<Record<keyof SignUpFormData, string>>;

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length < 4) return digits;

  if (digits.length < 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const SignUpForm = () => {
  const router = useRouter();

  const [form, setForm] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    phoneNum: "",
    email: "",
    password: "",
    role: "DRIVER",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverMessage, setServerMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof SignUpFormData;

    const formattedValue =
      fieldName === "phoneNum" ? formatPhoneNumber(value) : value;

    setForm((prev) => ({
      ...prev,
      [fieldName]: formattedValue,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: undefined,
    }));

    setServerMessage("");
  };

  const selectRole = (role: SignUpFormData["role"]) => {
    setForm((prev) => ({
      ...prev,
      role,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      role: undefined,
    }));

    setServerMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFieldErrors({});
    setServerMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      let data: {
        message?: string;
        fields?: Record<string, string[] | string>;
      };

      try {
        data = await res.json();
      } catch {
        data = { message: "Something went wrong" };
      }

      if (!res.ok) {
        setServerMessage(data.message || "Something went wrong");

        if (data.fields) {
          const flattenedErrors: FieldErrors = {};

          Object.entries(data.fields).forEach(([key, value]) => {
            const fieldKey = key as keyof SignUpFormData;

            if (Array.isArray(value) && value.length > 0) {
              flattenedErrors[fieldKey] = value[0];
            } else if (typeof value === "string") {
              flattenedErrors[fieldKey] = value;
            }
          });

          setFieldErrors(flattenedErrors);
        }

        return;
      }

      router.push("/dashboard");
    } catch {
      setServerMessage("Unable to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-white md:grid-cols-2">
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

      <div className="flex items-center justify-center px-6 py-10 sm:px-10 md:px-14">
        <div className="w-full max-w-xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            ← Back to Home
          </Link>

          <div className="mb-8 flex items-center gap-3 md:hidden">
            <Image
              src={DarkLogo}
              alt="SwiftShift logo"
              className="h-auto w-10 object-contain"
              priority
            />

            <p className="text-lg font-bold text-zinc-900">SwiftShift</p>
          </div>

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

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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
                      onClick={() =>
                        selectRole(role.value as SignUpFormData["role"])
                      }
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
                <p className="mt-2 text-sm font-medium text-red-500">
                  {fieldErrors.role}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormInput
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                placeholder="John"
                error={fieldErrors.firstName}
              />

              <FormInput
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                placeholder="Doe"
                error={fieldErrors.lastName}
              />
            </div>

            <FormInput
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="johndoe@swiftshift.com"
              error={fieldErrors.email}
            />

            <FormInput
              label="Phone Number"
              name="phoneNum"
              type="tel"
              value={form.phoneNum}
              onChange={onChange}
              placeholder="(123) 456-7890"
              error={fieldErrors.phoneNum}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="Create a strong password"
              error={fieldErrors.password}
            />

            {serverMessage && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-600">
                  {serverMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />

            <p className="whitespace-nowrap text-sm text-zinc-500">
              Already have an account?
            </p>

            <div className="h-px flex-1 bg-zinc-200" />
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

function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  name: keyof SignUpFormData;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-zinc-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-zinc-700 shadow-sm outline-none transition placeholder:text-zinc-400 focus:ring-4 ${
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
            : "border-zinc-300 focus:border-blue-500 focus:ring-blue-100"
        }`}
      />

      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default SignUpForm;