// components/HeroSection.tsx
"use client";

import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-b from-[#E6FAF5] to-white py-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        
        {/* Left: Testimonial Image */}
        <div className="w-full md:w-1/2 flex-shrink-0">
          <img
            src="/IELTS Testimonial - Aishwarya.png"
            alt="Aishwarya IELTS Testimonial"
            className="w-full h-auto rounded-xl shadow-lg object-cover aspect-[4/3]"
          />
        </div>

        {/* Right: Quote + CTAs */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-4xl font-bold text-gray-800 leading-tight">
            “My IELTS score went from <br/>Band 6 to 8 in just 4 weeks!”
          </h1>
          <p className="text-black">
            “I struggled with coherence in Writing until I tried IELTSExam.ai’s AI‑powered feedback.
            The detailed suggestions helped me fix mistakes instantly.”
          </p>
          <p className="font-semibold text-gray-900">
            — Aishwarya, Queen’s University, Canada
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 pt-4">
            <button
              onClick={() => router.push("/login")}
              className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
            >
              Get started for free
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </button>

            <button
              onClick={() => router.push("/ielts-mock-tests")}
              className="inline-flex items-center bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
            >
              Practise Mock Exams
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
