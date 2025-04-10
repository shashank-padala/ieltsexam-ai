"use client";

import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  // Handlers for each button
  const handleGetStarted = () => {
    router.push("/login");
  };

  const handleMockExams = () => {
    router.push("/ielts-mock-tests");
  };

  return (
    <section className="bg-gradient-to-b from-[#E6FAF5] to-white py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
          Your path to a perfect{" "}
          <span className="relative text-teal-600 inline-block">
            IELTS Score
            {/* Scribble underline SVG */}
            <svg
              className="absolute -bottom-2 left-1/2 -translate-x-1/2"
              width="120"
              height="12"
              viewBox="0 0 120 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 10C31.3333 2.66667 87.6 -0.799997 118 10"
                stroke="#00A885"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          begins here!
        </h1>

        {/* Buttons container */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {/* Button 1: Get started for free */}
          <button
            onClick={handleGetStarted}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5-5 5M6 12h12"
              />
            </svg>
          </button>

          {/* Button 2: Try Mock Exams */}
          <button
            onClick={handleMockExams}
            className="inline-flex items-center bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Try Mock Exams
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5-5 5M6 12h12"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
