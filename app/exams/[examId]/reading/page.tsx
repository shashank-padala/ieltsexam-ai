"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ClockIcon, BookOpenIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

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
  const router = useRouter();
  const [data, setData] = useState<ReadingData | null>(null);
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [activeQuestionNav, setActiveQuestionNav] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(60); // minutes left
  const timerRef = useRef<NodeJS.Timeout>();

  // Fetch reading data once examId is available
  useEffect(() => {
    async function fetchReadingData() {
      const res = await fetch(`/api/exams/${examId}/reading`);
      const json = await res.json();
      setData(json);
    }
    if (examId) {
      fetchReadingData();
    }
  }, [examId]);

  // Countdown timer: update every minute
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 60000);
    return () => clearInterval(timerRef.current);
  }, []);

  // When data or current passage changes, update active question navigation
  useEffect(() => {
    if (data) {
      const currentPassageQuestions = data.questions
        .filter((q) => q.passage_number === sortedPassages()[currentPassageIndex].passage_number)
        .sort((a, b) => a.question_number - b.question_number);
      setActiveQuestionNav(currentPassageQuestions);
    }
  }, [data, currentPassageIndex]);

  const handleSubmitTest = () => {
    console.log("Time's up! Auto-submitting test...");
    router.push(`/exams/${examId}/reading/submitted`);
  };

  // Helper: Sorted passages
  const sortedPassages = () => {
    return data ? [...data.passages].sort((a, b) => a.passage_number - b.passage_number) : [];
  };

  if (!data) {
    // All hooks have been declared above; safe to return early now.
    return <div className="bg-white min-h-screen text-black">Loading...</div>;
  }

  const passages = sortedPassages();
  const currentPassage = passages[currentPassageIndex];

  // Get questions for the current passage and determine min & max question numbers
  const questionsForPassage = data.questions.filter(
    (q) => q.passage_number === currentPassage.passage_number
  );
  const questionNumbers = questionsForPassage.map(q => q.question_number);
  const minQuestion = Math.min(...questionNumbers);
  const maxQuestion = Math.max(...questionNumbers);

  // Filter sections for the current passage
  const sectionsForPassage = data.sections
    .filter((sec) => sec.passage_number === currentPassage.passage_number)
    .sort((a, b) => a.section_number - b.section_number);

  // Sorted questions (for rendering in right pane)
  const sortedQuestions = [...questionsForPassage].sort(
    (a, b) => a.question_number - b.question_number
  );

  // Default header for left pane above passage title
  const defaultHeader = (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-1">Part {currentPassage.passage_number}</h2>
      <h3 className="text-xl font-semibold mb-1">
        READING PASSAGE {currentPassage.passage_number}
      </h3>
      <p className="text-base">
        You should spend about 20 minutes on Questions {minQuestion}-{maxQuestion}, which are based on Reading Passage {currentPassage.passage_number}.
      </p>
    </div>
  );

  // Bottom Navigation: Passage Tabs & Active Passage Question Nav
  const renderBottomNav = () => {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t">
        {/* Passage Tabs */}
        <div className="flex justify-around p-3">
          {passages.map((passage, idx) => {
            const qs = data.questions.filter(q => q.passage_number === passage.passage_number);
            const nums = qs.map(q => q.question_number);
            const minQ = Math.min(...nums);
            const maxQ = Math.max(...nums);
            return (
              <button
                key={passage.id}
                onClick={() => setCurrentPassageIndex(idx)}
                className={`px-4 py-2 rounded-lg text-base border ${
                  idx === currentPassageIndex
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black"
                }`}
              >
                Passage {passage.passage_number} ({minQ}-{maxQ} questions)
              </button>
            );
          })}
        </div>
        {/* Active Passage Question Navigation */}
        <div className="flex flex-wrap gap-3 justify-center p-3">
          {activeQuestionNav.map((q) => (
            <button
              key={q.id}
              onClick={() => {
                document.getElementById(`q-${q.id}`)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white text-base"
            >
              {q.question_number}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen text-black flex flex-col">
      {/* Fixed Top Navigation */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-center p-4 bg-white border-b z-20">
        <div className="absolute left-4">
          <Link href="/" className="flex items-center gap-2">
            <BookOpenIcon className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">IELTSExam.AI</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="w-6 h-6 text-blue-600" />
          <span className="text-lg font-semibold">{timeLeft} minutes left</span>
        </div>
        <div className="absolute right-4">
          <button
            onClick={handleSubmitTest}
            className="px-4 py-2 bg-blue-600 text-white rounded text-base"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Spacer for Fixed Header */}
      <div className="h-20"></div>

      {/* Main Content: Two Scrollable Panes */}
      <div className="flex flex-1">
        {/* Left Pane: Passage with Default Header */}
        <div className="w-1/2 p-6 overflow-y-scroll border-r" style={{ maxHeight: "calc(100vh - 160px)" }}>
          {defaultHeader}
          <h1 className="text-3xl font-bold mb-6">{currentPassage.passage_title}</h1>
          <p className="whitespace-pre-wrap text-lg leading-relaxed">
            {currentPassage.passage_text}
          </p>
        </div>

        {/* Right Pane: Questions */}
        <div className="w-1/2 p-6 overflow-y-scroll" style={{ maxHeight: "calc(100vh - 160px)" }}>
          {sectionsForPassage.map((section) => (
            <div key={section.id} className="mb-8 border-b pb-4">
              <h2 className="text-2xl font-semibold mb-2">{section.section_header}</h2>
              <p className="text-gray-600 mb-4">{section.section_instructions}</p>
              {sortedQuestions
                .filter((q) => q.section_number === section.section_number)
                .map((question) => (
                  <div
                    key={question.id}
                    id={`q-${question.id}`}
                    className="mb-6 p-4 bg-gray-50 rounded shadow-sm"
                  >
                    <p className="font-medium text-lg">
                      {question.question_number}. {question.question_text}
                    </p>
                    {question.question_type === "multiple_choice" &&
                      question.question_payload?.options && (
                        <div className="ml-4 mt-2">
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
                    {/* Render other question types as needed */}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      {renderBottomNav()}

      {/* Spacer for Fixed Footer */}
      <div className="h-20"></div>
    </div>
  );
}
