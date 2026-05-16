import LandingNavbar from "../components/layout/LandingNavbar";
import LandingFooter from "../components/layout/LandingFooter";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen scroll-smooth bg-white text-slate-950">
      <LandingNavbar />

      {children}

      <LandingFooter />
    </main>
  );
}