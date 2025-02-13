"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Passage {
  id: string;
  exam_id: string;
  passage_number: number;
  passage_title: string;
  passage_text: string;
  created_at: string;
}

interface Section {
  id: string;
  exam_id: string;
  passage_number: number;
  section_number: number;
  section_header: string;
  section_instructions: string;
  created_at: string;
}

interface Question {
  id: string;
  exam_id: string;
  passage_number: number;
  section_number: number;
  question_number: number;
  question_type: string;
  question_text: string;
  question_payload: any;
  correct_answer: string;
  created_at: string;
}

interface ReadingData {
  passages: Passage[];
  sections: Section[];
  questions: Question[];
}

export default function ReadingPage() {
  const { examId } = useParams();
  const [data, setData] = useState<ReadingData | null>(null);
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);

  useEffect(() => {
    async function fetchReadingData() {
      const res = await fetch(`/api/exams/${examId}/reading`);
      const json = await res.json();
      setData(json);
    }
    if (examId) fetchReadingData();
  }, [examId]);

  if (!data) return <div>Loading...</div>;

  // Sort passages by passage_number
  const sortedPassages = [...data.passages].sort(
    (a, b) => a.passage_number - b.passage_number
  );
  const currentPassage = sortedPassages[currentPassageIndex];

  // Filter sections and questions for the current passage
  const sectionsForPassage = data.sections
    .filter((sec) => sec.passage_number === currentPassage.passage_number)
    .sort((a, b) => a.section_number - b.section_number);

  const questionsForPassage = data.questions.filter(
    (q) => q.passage_number === currentPassage.passage_number
  );
  const groupQuestionsBySection = (sectionNumber: number) => {
    return questionsForPassage
      .filter((q) => q.section_number === sectionNumber)
      .sort((a, b) => a.question_number - b.question_number);
  };

  const totalPassages = sortedPassages.length;

  const handlePrevPassage = () => {
    if (currentPassageIndex > 0) {
      setCurrentPassageIndex(currentPassageIndex - 1);
    }
  };

  const handleNextPassage = () => {
    if (currentPassageIndex < totalPassages - 1) {
      setCurrentPassageIndex(currentPassageIndex + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Timer and Submit Button */}
      <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
        <div>
          Time Remaining: <span id="timer">60:00</span>
        </div>
        <button className="px-4 py-2 bg-white text-blue-600 rounded">
          Submit
        </button>
      </header>

      {/* Main Content: Split screen with Passage and Questions */}
      <div className="flex flex-1">
        {/* Left Pane: Current Passage */}
        <div className="w-1/2 p-6 overflow-y-auto border-r">
          <h1 className="text-2xl font-bold mb-4">
            {currentPassage.passage_title}
          </h1>
          <p className="whitespace-pre-wrap">{currentPassage.passage_text}</p>
        </div>

        {/* Right Pane: Questions for Current Passage */}
        <div className="w-1/2 p-6 overflow-y-auto">
          {sectionsForPassage.map((section) => (
            <div key={section.id} className="mb-8">
              <h2 className="text-xl font-semibold">
                {section.section_header}
              </h2>
              <p className="mb-4">{section.section_instructions}</p>
              {groupQuestionsBySection(section.section_number).map(
                (question) => (
                  <div key={question.id} className="mb-4">
                    <p className="font-medium">
                      {question.question_number}. {question.question_text}
                    </p>
                    {question.question_type === "multiple_choice" &&
                      question.question_payload?.options && (
                        <div className="ml-4">
                          {Object.entries(question.question_payload.options).map(
                            ([optionKey, optionText]) => (
                              <div key={optionKey} className="flex items-center mb-1">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={optionKey}
                                  className="mr-2"
                                />
                                <span>
                                  {optionKey}: {optionText}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    {/* Add rendering for other question types as needed */}
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer: Passage Navigation */}
      <footer className="p-4 bg-gray-200 flex justify-between">
        <button
          onClick={handlePrevPassage}
          disabled={currentPassageIndex === 0}
          className="px-4 py-2 bg-white text-blue-600 rounded disabled:opacity-50"
        >
          Previous Passage
        </button>
        <div>
          Passage {currentPassage.passage_number} of {totalPassages}
        </div>
        <button
          onClick={handleNextPassage}
          disabled={currentPassageIndex === totalPassages - 1}
          className="px-4 py-2 bg-white text-blue-600 rounded disabled:opacity-50"
        >
          Next Passage
        </button>
      </footer>
    </div>
  );
}
