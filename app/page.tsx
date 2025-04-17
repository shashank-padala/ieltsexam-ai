// pages/index.tsx
"use client";

import { useAuth } from "@/context/AuthContext"; // Adjust the import path as needed
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import IELTSExamLibrary from "@/components/IELTSExamLibrary";
import TestimonialsSection from "@/components/TestimonialsSection";
import AishwaryaTestimonialSection from "@/components/AishwaryaTestimonialSection";

export default function Home() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoggedIn ? (
        <>
          <IELTSExamLibrary />
        </>
      ) : (
        <>
          <HeroSection />
          <FeaturesSection />
          <TestimonialsSection />
          <IELTSExamLibrary />
        </>
      )}
    </div>
  );
}
