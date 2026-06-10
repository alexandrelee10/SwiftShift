import LandingNavbar from "../components/landingPage/nav/LandingNavbar";
import LandingFooter from "../components/landingPage/nav/LandingFooter";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen scroll-smooth bg-white text-slate-950">
      <LandingNavbar />

      <main>{children}</main> 

      <LandingFooter />
    </main>
  );
}