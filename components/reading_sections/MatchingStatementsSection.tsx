"use client";

import React from "react";

interface MatchingStatementsSectionProps {
  questions: Array<{
    id: string;
    question_text: string;
    question_number: number;
  }>;
  sharedOptions:  Array<{ key: string; text: string }>;
  responses?: { [key: string]: string };
  onAnswerChange?: (questionNumber: string, value: string) => void;
}

export default function MatchingStatementsSection({
  questions = [],
  sharedOptions,
  responses = {},
  onAnswerChange,
}: MatchingStatementsSectionProps) {
  const options = sharedOptions ?? {};
  
  return (
    <div className="space-y-4">
      {/* Shared Options Block */}
      <div className="mb-4">
        <table className="w-full border border-gray-300 mt-2">
          <tbody>
          {(sharedOptions.map((option) => (
            <tr key={option.key} className="border-b border-gray-300">
              <td className="px-4 py-2 font-bold">{option.key}.</td>
              <td className="px-4 py-2">{option.text}</td>
            </tr>
          )))}
          </tbody>
        </table>
      </div>
      {/* Render Each Matching Question */}
      {questions.map((question) => {
        const questionNumber = question.question_number.toString();
        return (
          <div key={question.id} id={`q-${question.id}`} className="mb-2 text-lg">
            <strong>{question.question_number}.</strong>{" "}
            <select
              id={`question-${question.id}`}
              name={`question-${question.id}`}
              className="border border-gray-300 rounded px-2 py-1 mr-2"
              value={responses[questionNumber] || ""}
              onChange={(e) =>
                onAnswerChange && onAnswerChange(questionNumber, e.target.value)
              }
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
        );
      })}
    </div>
  );
}
