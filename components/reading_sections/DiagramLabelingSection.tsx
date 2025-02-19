"use client";

import React from "react";

interface DiagramLabelingSectionProps {
  // Contains at least an image_url field for the diagram
  section: {
    content: {
      image_url?: string; // The diagram's image URL
    };
  };
  // Each question row has a question_number, etc.
  questions: Array<{
    id: string;
    question_number: number;
    question_text: string; // optional or empty
  }>;
  // The current global responses, keyed by question_number
  responses: { [key: string]: string };
  // Callback to update the global responses
  onAnswerChange: (questionNumber: string, value: string) => void;
}

export default function DiagramLabelingSection({
  section,
  questions,
  responses,
  onAnswerChange,
}: DiagramLabelingSectionProps) {
  const imageUrl = section.content.image_url || "";

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      {/* Diagram Image */}
      {imageUrl && (
        <div className="mb-4">
          <img src={imageUrl} alt="Diagram" className="max-w-full h-auto" />
        </div>
      )}

      {/* Label Inputs */}
      <div className="space-y-4">
        {questions.map((question) => {
          const qNumStr = question.question_number.toString();
          return (
            <div key={question.id} id={`q-${question.id}`}>
              {/* If you want to display a label like "21." you can do so here: */}
              <label htmlFor={`question-${question.id}`} className="font-semibold block mb-1">
                {question.question_number}.
              </label>
              <input
                id={`question-${question.id}`}
                type="text"
                className="border border-gray-300 rounded px-2 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={responses[qNumStr] || ""}
                onChange={(e) => onAnswerChange(qNumStr, e.target.value)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
