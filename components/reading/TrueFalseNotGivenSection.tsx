"use client";

import React from "react";

interface TrueFalseNotGivenProps {
  question: {
    id: string;
    question_text: string;
  };
}

export default function TrueFalseNotGiven({ question }: TrueFalseNotGivenProps) {
  const options = ["True", "False", "Not Given"];

  return (
    <div className="flex items-center gap-4">
      <select className="border border-gray-300 rounded px-2 py-1">
        <option value=""></option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
