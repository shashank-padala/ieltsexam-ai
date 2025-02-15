"use client";

import React from "react";

interface YesNoNotGivenProps {
  question: {
    id: string;
    question_text: string;
  };
  value: string;
  onAnswerChange: (value: string) => void;
}

export default function YesNoNotGiven({
  question,
  value,
  onAnswerChange,
}: YesNoNotGivenProps) {
  const options = ["Yes", "No", "Not Given"];

  return (
    <div className="mt-4">
      <select
        id={`question-${question.id}`}
        name={`question-${question.id}`}
        className="border border-gray-300 rounded px-2 py-1"
        value={value}
        onChange={(e) => onAnswerChange(e.target.value)}
      >
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
