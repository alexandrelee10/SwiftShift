import LandingNavbar from "../components/driver/layout/LandingNavbar";
import LandingFooter from "../components/driver/layout/LandingFooter";

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