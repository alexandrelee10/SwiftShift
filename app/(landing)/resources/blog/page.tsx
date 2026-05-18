import Image from "next/image";
import Link from "next/link";
import TruckImg from "@/public/assets/landingPage/leadership/hero/hero.png"
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Newspaper,
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function BlogPage() {
  const featuredPost = {
    title: "Building Safer Freight Operations With Better Visibility",
    description:
      "How modern load boards can help drivers, brokers, and teams stay organized, informed, and compliant from pickup to delivery.",
    category: "Safety",
    date: "May 17, 2026",
    readTime: "6 min read",
    image: TruckImg,
  };

  const posts = [
    {
      title: "What Drivers Should Check Before Booking a Load",
      description:
        "A simple breakdown of what to review before accepting freight, from pickup details to rate, distance, and equipment needs.",
      category: "Drivers",
      date: "May 12, 2026",
      readTime: "4 min read",
      icon: Truck,
    },
    {
      title: "Why Compliance Matters in Freight Technology",
      description:
        "Compliance is more than paperwork. It protects drivers, brokers, customers, and the entire operation.",
      category: "Compliance",
      date: "May 8, 2026",
      readTime: "5 min read",
      icon: ShieldCheck,
    },
    {
      title: "How Brokers Can Keep Load Communication Clear",
      description:
        "Better communication helps reduce confusion, missed updates, and unnecessary delays between all parties.",
      category: "Brokers",
      date: "May 1, 2026",
      readTime: "3 min read",
      icon: Newspaper,
    },
  ];

  const categories = ["All", "Drivers", "Brokers", "Safety", "Compliance"];

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.08),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                <Newspaper size={24} />
              </div>

              <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
                Swift Shift Blog
              </span>
            </div>

            <h1 className="text-5xl font-black tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
              Freight Insights,
              <span className="text-blue-600"> Built For Operators</span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-500 sm:text-xl">
              Practical articles for drivers, brokers, and freight teams focused
              on safety, compliance, load visibility, and smarter operations.
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                index === 0
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:border-blue-200 hover:text-blue-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[320px]">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
              <span className="w-fit rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-600">
                Featured Article
              </span>

              <h2 className="mt-6 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
                {featuredPost.title}
              </h2>

              <p className="mt-5 text-lg leading-8 text-zinc-500">
                {featuredPost.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-5 text-sm font-medium text-zinc-500">
                <div className="flex items-center gap-2">
                  <CalendarDays size={17} />
                  {featuredPost.date}
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={17} />
                  {featuredPost.readTime}
                </div>
              </div>

              <Link
                href="#"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Read Article
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* POSTS */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Latest Posts
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              Recent Freight Articles
            </h2>
          </div>

          <Link
            href="#"
            className="text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            View all articles
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => {
            const Icon = post.icon;

            return (
              <article
                key={post.title}
                className="group rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/40"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={25} />
                </div>

                <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium text-zinc-500">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="mt-4 text-xl font-black leading-snug text-zinc-900">
                  {post.title}
                </h3>

                <p className="mt-4 leading-7 text-zinc-500">
                  {post.description}
                </p>

                <Link
                  href="#"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition group-hover:gap-3"
                >
                  Read more
                  <ArrowRight size={16} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}