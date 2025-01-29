import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AppRouter from "@/routes/AppRouter";
import { ClerkProvider } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";

export default function App() {
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
  }

  const { pathname } = useLocation();

  const isSoloRoomRoute =
    /^\/solo-room\/[^/]+$/.test(pathname) ||
    /^\/online-room\/[^/]+$/.test(pathname);

  const shouldNavAndFooter = !isSoloRoomRoute;

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Suspense
        fallback={
          <div className="w-full h-screen flex items-center justify-center">
            <Loader2 className="size-6 text-primaryPurple" />
          </div>
        }
      >
        {shouldNavAndFooter && <Navbar />}
        <AppRouter />
        {shouldNavAndFooter && <Footer />}
        <Toaster richColors />
      </Suspense>
    </ClerkProvider>
  );
}
