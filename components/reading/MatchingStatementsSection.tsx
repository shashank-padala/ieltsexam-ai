"use client";

import React from "react";

interface MatchingStatementsSectionProps {
  questions: Array<{
    id: string;
    question_text: string;
    question_number: number;
  }>;
  sharedOptions?: { [key: string]: string } | null;
}

export default function MatchingStatementsSection({
  questions = [],
  sharedOptions,
}: MatchingStatementsSectionProps) {
  const options = sharedOptions ?? {};
  
  return (
    <div className="space-y-4">
      {/* Shared Options Block */}
      <div className="mb-4">
        <table className="w-full border border-gray-300 mt-2">
          <tbody>
            {Object.entries(options).map(([key, val]) => (
              <tr key={key} className="border-b border-gray-300">
                <td className="px-4 py-2 font-bold">{key}.</td>
                <td className="px-4 py-2">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Render Each Matching Question */}
      {questions.map((question) => (
        <div key={question.id} id={`q-${question.id}`} className="mb-2 text-lg">
          <strong>{question.question_number}.</strong>{" "}
          <select
            id={`question-${question.id}`}
            name={`question-${question.id}`}
            className="border border-gray-300 rounded px-2 py-1 mr-2"
          >
            <option value=""></option>
            {Object.entries(options).map(([key]) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>{" "}
          {question.question_text}
        </div>
      ))}
    </div>
  );
}
