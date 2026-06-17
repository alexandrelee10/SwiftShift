"use client";

import BackButton from "@/app/components/shared/BackButton";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";

type FormState = {
  originalPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

export default function ChangePasswordForm() {
  const [form, setForm] = useState<FormState>({
    originalPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [serverMessage, setServerMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors: FieldErrors = {};

    if (!form.originalPassword.trim()) {
      errors.originalPassword = "Current password is required.";
    }

    if (!form.newPassword.trim()) {
      errors.newPassword = "New password is required.";
    } else if (form.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters.";
    }

    if (!form.confirmNewPassword.trim()) {
      errors.confirmNewPassword = "Please confirm your new password.";
    } else if (form.newPassword !== form.confirmNewPassword) {
      errors.confirmNewPassword = "Passwords do not match.";
    }

    if (
      form.originalPassword &&
      form.newPassword &&
      form.originalPassword === form.newPassword
    ) {
      errors.newPassword = "New password must be different.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerMessage("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/settings/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setServerMessage(data?.message || "Failed to update password.");
        return;
      }

      setServerMessage(data?.message || "Password updated successfully.");

      setForm({
        originalPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setFieldErrors({});
    } catch {
      setServerMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as {
      name: keyof FormState;
      value: string;
    };

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <ArrowLeftIcon size={16} />
          <BackButton />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 pb-5 dark:border-slate-800">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Change Password
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Update your password to keep your account secure.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <PasswordInput
              label="Current password"
              name="originalPassword"
              value={form.originalPassword}
              onChange={onChange}
              placeholder="Enter current password"
              error={fieldErrors.originalPassword}
            />

            <PasswordInput
              label="New password"
              name="newPassword"
              value={form.newPassword}
              onChange={onChange}
              placeholder="Enter new password"
              error={fieldErrors.newPassword}
            />

            <PasswordInput
              label="Confirm new password"
              name="confirmNewPassword"
              value={form.confirmNewPassword}
              onChange={onChange}
              placeholder="Confirm new password"
              error={fieldErrors.confirmNewPassword}
            />

            {serverMessage && (
              <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {serverMessage}
              </p>
            )}

            <div className="flex justify-end border-t border-slate-100 pt-5 dark:border-slate-800">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                {isSubmitting ? "Updating..." : "Update password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <input
        type="password"
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4 dark:bg-slate-950 ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-900 dark:focus:ring-red-950"
            : "border-slate-200 focus:border-slate-400 focus:ring-slate-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-950"
        }`}
        placeholder={placeholder}
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}