// pages/about.tsx

import React from "react";

export default function About() {
  return (
    <div className="bg-white mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">About IELTSExam.ai</h1>
      <p className="mb-4">
        Welcome to IELTSExam.ai – a platform dedicated to helping students and immigrants achieve their dreams through quality IELTS exam preparation and resources.
      </p>
      <p className="mb-4">
        I’m Shashank Padala, the CEO of IELTSExam.ai. As an international individual and an immigrant to Canada, I understand firsthand the challenges of adapting to a new culture and educational system. My journey has fueled my passion to support more students and immigrants on their path to success.
      </p>
      <p className="mb-4">
        To learn more about my professional journey and vision, feel free to connect with me on{" "}
        <a
          href="https://www.linkedin.com/in/shashank-padala/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          LinkedIn
        </a>.
      </p>
    </div>
  );
}
