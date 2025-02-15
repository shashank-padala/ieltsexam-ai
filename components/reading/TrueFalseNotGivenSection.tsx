"use client";

import React from "react";

interface TrueFalseNotGivenProps {
  question: {
    id: string;
    question_text: string;
  };
  value: string;
  onAnswerChange: (value: string) => void;
}

export default function TrueFalseNotGiven({
  question,
  value,
  onAnswerChange,
}: TrueFalseNotGivenProps) {
  const options = ["True", "False", "Not Given"];

  return (
    <div className="mt-4">
      <div
        className="mb-2 text-lg whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: question.question_text }}
      />
      <select
        id={`question-${question.id}`}
        name={`question-${question.id}`}
        className="border border-gray-300 rounded px-2 py-1"
        value={value}
        onChange={(e) => onAnswerChange(e.target.value)}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
