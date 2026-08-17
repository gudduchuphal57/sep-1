"use client";
import { useState } from "react";
import MotionShell from "./motion-shell";
import HomeNav from "./home-nav";
import HeroSection from "./hero-section";
import LaunchSection from "./launch-section";
import BusinessOnboarding from "@/components/sections/businessonboarding";
import { FooterProvider } from "@/components/layout/footercontext";

export default function HomeExperience() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  return (
    <FooterProvider>
      {!showOnboarding ? (
        <MotionShell>
          <main className="overflow-clip bg-[#050b13] selection:bg-[#b9ff66] selection:text-[#07111e]">
            <HomeNav />
            <HeroSection onStart={() => setShowOnboarding(true)} />
            <LaunchSection />
          </main>
        </MotionShell>
      ) : (
        <BusinessOnboarding onBack={() => setShowOnboarding(false)} />
      )}
    </FooterProvider>
  );
}
