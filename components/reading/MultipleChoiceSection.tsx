"use client";

import React from "react";

interface MultipleChoiceProps {
  question: {
    id: string;
    question_text: string; // May contain HTML or newlines
    question_payload: {
      options: { [key: string]: string };
    };
  };
  value: string;
  onAnswerChange: (value: string) => void;
}

export default function MultipleChoice({ question, value, onAnswerChange }: MultipleChoiceProps) {
  const options = question.question_payload?.options || {};

  return (
    <div className="mt-4">
      <div
        className="mb-2 text-lg whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: question.question_text }}
      />
      {Object.entries(options).map(([optionKey, optionText]) => (
        <div key={optionKey} className="flex items-center mb-2">
          <input
            id={`question-${question.id}-option-${optionKey}`}
            type="radio"
            name={`question-${question.id}`}
            value={optionKey}
            checked={value === optionKey}
            onChange={() => onAnswerChange(optionKey)}
            className="mr-2"
          />
          <label htmlFor={`question-${question.id}-option-${optionKey}`} className="text-lg">
            <span className="font-semibold">{optionKey}:</span> {optionText}
          </label>
        </div>
      ))}
    </div>
  );
}
