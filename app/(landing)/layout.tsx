import { Navbar } from "@/app/components/landing/Navbar";
import { Footer } from "@/app/components/landing/Footer";
import { AuthModalProvider } from "@/app/components/landing/AuthModalProvider";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthModalProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </AuthModalProvider>
  );
}
