"use client";

import React, { useState } from "react";

interface MultipleSelectSectionProps {
  sectionId: string;
  questions: Array<{ id: string; question_number: number }>;
  sharedOptions: Array<{ key: string; text: string }>;
  sharedQuestionText: string;
  responses: { [key: string]: string };
  onAnswerChange: (questionNumber: string, value: string) => void;
}

export default function MultipleSelectSection({
  sectionId,
  questions,
  sharedOptions,
  sharedQuestionText,
  responses,
  onAnswerChange,
}: MultipleSelectSectionProps) {
  // Set maxSelect to the number of question rows
  const maxSelect = questions.length;
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);

  const handleCheckboxChange = (letter: string) => {
    if (selectedLetters.includes(letter)) {
      // If already selected, remove it.
      const newSelected = selectedLetters.filter((l) => l !== letter);
      setSelectedLetters(newSelected);
      assignSelectionsToQuestions(newSelected);
    } else {
      // Only add if selection limit not reached.
      if (selectedLetters.length < maxSelect) {
        const newSelected = [...selectedLetters, letter];
        setSelectedLetters(newSelected);
        assignSelectionsToQuestions(newSelected);
      }
    }
  };

  // Map each selected letter to its corresponding question number.
  const assignSelectionsToQuestions = (letters: string[]) => {
    questions.forEach((q, index) => {
      const letter = letters[index] ?? "";
      onAnswerChange(q.question_number.toString(), letter);
    });
  };

  return (
    <div id={`q-multi-${sectionId}`} className="p-4 border rounded bg-white">
      {/* Shared prompt */}
      <div
        className="text-black mb-4 whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: sharedQuestionText }}
      />
      <p className="mb-2 text-sm text-gray-600">
        (Select {maxSelect} letter{maxSelect > 1 ? "s" : ""})
      </p>
      <div className="space-y-2">
        {sharedOptions.map((option) => {
          const isChecked = selectedLetters.includes(option.key);
          return (
            <label key={option.key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleCheckboxChange(option.key)}
              />
              <span>
                <strong>{option.key}</strong>: {option.text}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
