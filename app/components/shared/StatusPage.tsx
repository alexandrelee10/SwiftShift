import Link from "next/link";

type StatusPageProps = {
  title: string;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function StatusPage({
  title,
  message,
  ctaLabel,
  ctaHref,
}: StatusPageProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          {title}
        </h1>

        {/* Message */}
        <p className="text-zinc-600 dark:text-zinc-400">
          {message}
        </p>

        {/* CTA Button */}
        {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="inline-block rounded-lg bg-black text-white px-5 py-2.5 text-sm font-medium hover:bg-zinc-800 transition dark:bg-white dark:text-black"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}