"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";


export default function ChangePasswordForm() {



    const [form, setForm] = useState({
        originalPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [serverMessage, setServerMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({})

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setServerMessage("");

        const res = await fetch('/api/settings/changePassword', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        
    }

    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        setFieldErrors((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
            <div className="mx-auto max-w-2xl">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="border-b border-slate-100 pb-5">
                        <h2 className="text-xl font-semibold tracking-tight">
                            Change Password
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Update your password to keep your account secure.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Current password
                            </label>
                            <input
                                type="password"
                                name="originalPassword"
                                value={form.originalPassword}
                                onChange={onChange}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                placeholder="Enter current password"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                New password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={form.newPassword}
                                onChange={onChange}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                placeholder="Enter new password"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Confirm new password
                            </label>
                            <input
                                type="password"
                                name="confirmNewPassword"
                                value={form.confirmNewPassword}
                                onChange={onChange}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                placeholder="Confirm new password"
                            />
                        </div>

                        {serverMessage && (
                            <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                                {serverMessage}
                            </p>
                        )}

                        <div className="flex justify-end border-t border-slate-100 pt-5">
                            <button
                                type="submit"
                                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                            >
                                Update password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}