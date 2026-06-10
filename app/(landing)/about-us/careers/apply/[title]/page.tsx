"use client";

import BackButton from "@/app/components/shared/BackButton";
import { CheckCircle2, Upload, User } from "lucide-react";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function JobApplicationPage() {
    const [submitted, setSubmitted] = useState(false);

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-4xl px-6 py-10">
                <Link
                    href="/about-us/careers"
                    className="mb-8 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-zinc-700 hover:text-blue-600 backdrop-blur transition hover:bg-white/10"
                >
                    <ArrowLeft size={16} />
                    Back to Careers
                </Link>

                {submitted && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
                        <CheckCircle2 size={20} />
                        <p className="font-semibold">
                            Application submitted successfully. We'll review your application
                            and get back to you soon.
                        </p>
                    </div>
                )}

                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="mb-8">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
                            <User size={28} />
                        </div>

                        <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
                            Careers
                        </p>

                        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                            Job Application
                        </h1>

                        <p className="mt-4 text-slate-500">
                            Complete the form below to apply for this position at SwiftShift.
                        </p>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setSubmitted(true);
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });
                        }}
                        className="space-y-8"
                    >
                        {/* Personal Information */}
                        <div>
                            <h2 className="mb-4 text-xl font-black text-slate-950">
                                Personal Information
                            </h2>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        First Name
                                    </label>

                                    <input
                                        type="text"
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Last Name
                                    </label>

                                    <input
                                        type="text"
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Phone Number
                                    </label>

                                    <input
                                        type="tel"
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <h2 className="mb-4 text-xl font-black text-slate-950">
                                Location
                            </h2>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Country
                                    </label>

                                    <input
                                        type="text"
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Experience */}
                        <div>
                            <h2 className="mb-4 text-xl font-black text-slate-950">
                                Experience
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        LinkedIn Profile
                                    </label>

                                    <input
                                        type="url"
                                        placeholder="https://linkedin.com/in/..."
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Portfolio / Website
                                    </label>

                                    <input
                                        type="url"
                                        placeholder="https://yourwebsite.com"
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Tell us about yourself
                                    </label>

                                    <textarea
                                        rows={6}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                                        placeholder="Tell us why you'd be a great fit..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Resume */}
                        <div>
                            <h2 className="mb-4 text-xl font-black text-slate-950">
                                Resume
                            </h2>

                            <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center transition hover:border-blue-400">
                                <Upload size={32} className="mb-3 text-blue-600" />

                                <p className="font-bold text-slate-800">
                                    Upload Resume (PDF)
                                </p>

                                <p className="mt-2 text-sm text-slate-500">
                                    Drag and drop or click to upload
                                </p>

                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Questions */}
                        <div>
                            <h2 className="mb-4 text-xl font-black text-slate-950">
                                Additional Questions
                            </h2>

                            <div className="space-y-5">
                                {/* Legal Authorization Question */}
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Are you legally authorized to work in the United States?
                                    </label>

                                    <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                </div>
                                {/* Sponsorship Question */}
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Will you now or in the future require sponsorship for employment visa status (e.g., H-1B, TN, O-1, etc.)?
                                    </label>

                                    <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                </div>
                                {/* Full Time / Part Time Questions */}
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Are you available to work full-time?
                                    </label>

                                    <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Desired Salary
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="$60,000"
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white transition hover:bg-blue-700"
                        >
                            Submit Application
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}