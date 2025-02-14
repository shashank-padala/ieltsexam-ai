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
}

export default function MultipleChoice({ question }: MultipleChoiceProps) {
  const options = question.question_payload?.options || {};

  return (
    <div className="mt-4">
      {/* 
        Render the question text with HTML and newlines preserved.
        If you only need newlines (not HTML tags), you could use:
        <p className="whitespace-pre-wrap">{question.question_text}</p>
      */}
      <div
        className="mb-2 text-lg whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: question.question_text }}
      />

      {Object.entries(options).map(([optionKey, optionText]) => (
        <div key={optionKey} className="flex items-center mb-2">
          <input
            type="radio"
            name={`question-${question.id}`}
            value={optionKey}
            className="mr-2"
          />
          <label className="text-lg">
            <span className="font-semibold">{optionKey}:</span> {optionText}
          </label>
        </div>
      ))}
    </div>
  );
}
