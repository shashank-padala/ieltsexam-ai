"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ClockIcon, BookOpenIcon, TrophyIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Passage {
  id: string;
  passage_number: number;
  passage_title: string;
  passage_text: string;
}

interface Section {
  id: string;
  passage_number: number;
  section_number: number;
  section_header: string;
  section_instructions: string;
}

interface Question {
  id: string;
  passage_number: number;
  section_number: number;
  question_number: number;
  question_text: string;
  correct_answer: string;
}

interface ReadingData {
  passages: Passage[];
  sections: Section[];
  questions: Question[];
}

interface Evaluation {
  responses: { [key: string]: string };
  correct_count: number;
  band_score: number;
  submitted_at: string;
}

export default function ReadingEvaluationPage() {
  const { examId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<ReadingData | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [activeQuestionNav, setActiveQuestionNav] = useState<Question[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  // Fetch reading data
  useEffect(() => {
    async function fetchReadingData() {
      const res = await fetch(`/api/exams/${examId}/reading`);
      const json = await res.json();
      setData(json);
    }
    if (examId) fetchReadingData();
  }, [examId]);

  // Fetch evaluation data with proper auth
  useEffect(() => {
    async function fetchEvaluation() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const token = session.access_token;
      const res = await fetch(`/api/exams/${examId}/reading/evaluation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.error("Failed to fetch evaluation", res.statusText);
        return;
      }
      const json = await res.json();
      setEvaluation(json);
    }
    if (examId) fetchEvaluation();
  }, [examId]);

  // Update active question navigation for current passage
  useEffect(() => {
    if (data) {
      const currentPassageQuestions = data.questions
        .filter((q) => q.passage_number === sortedPassages()[currentPassageIndex].passage_number)
        .sort((a, b) => a.question_number - b.question_number);
      setActiveQuestionNav(currentPassageQuestions);
    }
  }, [data, currentPassageIndex]);

  // Helper: Sort passages by passage_number
  const sortedPassages = () => {
    return data ? [...data.passages].sort((a, b) => a.passage_number - b.passage_number) : [];
  };

  if (!data || !evaluation) {
    return <div className="bg-white min-h-screen text-black">Loading evaluation...</div>;
  }

  const passages = sortedPassages();
  const currentPassage = passages[currentPassageIndex];

  // Determine question range for current passage
  const questionsForPassage = data.questions.filter(
    (q) => q.passage_number === currentPassage.passage_number
  );
  const questionNumbers = questionsForPassage.map((q) => q.question_number);
  const minQuestion = Math.min(...questionNumbers);
  const maxQuestion = Math.max(...questionNumbers);

  // Filter and sort sections for the current passage
  const sectionsForPassage = data.sections
    .filter((sec) => sec.passage_number === currentPassage.passage_number)
    .sort((a, b) => a.section_number - b.section_number);

  // Sorted questions for the active passage
  const sortedQuestions = [...questionsForPassage].sort(
    (a, b) => a.question_number - b.question_number
  );

  // Default header for left pane
  const defaultHeader = (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-1">Part {currentPassage.passage_number}</h2>
      <h3 className="text-xl font-semibold mb-1">
        READING PASSAGE {currentPassage.passage_number}
      </h3>
      <p className="text-base">
        You should have answered Questions {minQuestion}-{maxQuestion} based on this passage.
      </p>
    </div>
  );

  // Render an evaluated question with feedback
  const renderEvaluatedQuestion = (question: Question) => {
    const userAnswer = evaluation.responses[question.question_number.toString()] || "";
    const isCorrect =
      userAnswer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase();

    return (
      <div key={question.id} id={`q-${question.id}`} className="mb-4 p-4 bg-gray-50 rounded shadow-sm">
        <p className="font-medium text-lg whitespace-pre-wrap">
          {question.question_number}. {question.question_text}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-lg">
            Your Answer: <strong>{userAnswer || "No Answer"}</strong>
          </p>
          <p className="text-lg">
            Correct Answer: <strong>{question.correct_answer}</strong>
          </p>
          {isCorrect ? (
            <CheckIcon className="w-6 h-6 text-green-600" />
          ) : (
            <XMarkIcon className="w-6 h-6 text-red-600" />
          )}
        </div>
      </div>
    );
  };

  // Render bottom navigation: Passage Tabs & Question Navigation
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
                Passage {passage.passage_number} (<strong>{minQ} - {maxQ}</strong>)
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
        <div className="absolute right-4">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded text-base"
          >
            Home
          </button>
        </div>
      </header>

      {/* Spacer for Fixed Header */}
      <div className="h-20"></div>

      {/* Evaluation Header Section */}
      <div className="p-4 bg-blue-50 rounded-lg mx-6 mb-4 shadow-md">
        <h1 className="text-3xl font-bold text-center">Reading Evaluation</h1>
        <p className="mt-2 text-xl text-center">
          Band Score: <strong>{evaluation.band_score}</strong>
        </p>
        <p className="mt-1 text-lg text-center">
          Correct Answers: <strong>{evaluation.correct_count}</strong> out of 40
        </p>
      </div>


      {/* Spacer for Fixed Header */}
      <div className="h-20"></div>

      {/* Main Content: Two Scrollable Panes */}
      <div className="flex flex-1">
        {/* Left Pane: Passage */}
        <div className="w-1/2 p-6 overflow-y-scroll border-r pb-32" style={{ maxHeight: "calc(100vh - 160px)" }}>
          {defaultHeader}
          <h1 className="text-3xl font-bold mb-6">{currentPassage.passage_title}</h1>
          <p className="whitespace-pre-wrap text-lg leading-relaxed">
            {currentPassage.passage_text}
          </p>
        </div>

        {/* Right Pane: Evaluated Questions */}
        <div className="w-1/2 p-6 overflow-y-scroll pb-32" style={{ maxHeight: "calc(100vh - 160px)" }}>
          {sectionsForPassage.map((section) => {
            const sectionQuestions = sortedQuestions.filter(q => q.section_number === section.section_number);
            return (
              <div key={section.id} id={`section-${section.section_number}`} className="mb-8 border-b pb-4">
                <h2 className="text-2xl font-semibold mb-2">{section.section_header}</h2>
                <div
                  className="text-gray-600 mb-4 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: section.section_instructions }}
                />
                {sectionQuestions.map(renderEvaluatedQuestion)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      {renderBottomNav()}

      {/* Spacer for Fixed Footer */}
      <div className="h-20"></div>
    </div>
  );
}
