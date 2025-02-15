"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ClockIcon,
  BookOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

// Import question-type components
import MultipleChoice from "@/components/reading/MultipleChoiceSection";
import SummaryCompletion from "@/components/reading/SummaryCompletionSection";
import MatchingStatements from "@/components/reading/MatchingStatementsSection";
import TrueFalseNotGiven from "@/components/reading/TrueFalseNotGivenSection";
import YesNoNotGiven from "@/components/reading/YesNoNotGivenSection";

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
  section_question_type: string;
  shared_options?: any;
  content?: any;
  created_at: string;
}

interface Question {
  id: string;
  exam_id: string;
  passage_number: number;
  section_number: number;
  question_number: number;
  question_text: string;
  question_payload?: any;
  correct_answer?: string | null;
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
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [evaluation, setEvaluation] = useState<any>(null);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);

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

  // Update active question navigation when data or current passage changes
  useEffect(() => {
    if (data) {
      const currentPassageQuestions = data.questions
        .filter(
          (q) =>
            q.passage_number === sortedPassages()[currentPassageIndex].passage_number
        )
        .sort((a, b) => a.question_number - b.question_number);
      setActiveQuestionNav(currentPassageQuestions);
    }
  }, [data, currentPassageIndex]);

  // Helper: Fetch exam type from /api/exams/[examId]
  const fetchExamType = async (examId: string): Promise<string | null> => {
    const res = await fetch(`/api/exams/${examId}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      console.error("Failed to fetch exam type:", await res.text());
      return null;
    }
    const json = await res.json();
    return json.exam.type;
  };

  // Handler for answer change from child components
  const handleAnswerChange = (questionNumber: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionNumber]: value,
    }));
  };

  // Updated handleSubmitTest function
  const handleSubmitTest = async () => {
    if (examSubmitted) return; // Prevent multiple submissions
    console.log("Submitting test...");

    // Retrieve current session from Supabase Auth
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error("No valid session found.");
      return;
    }
    const token = session.access_token;
    const user_id = session.user.id;

    // Fetch exam type from the exams table using our dedicated API route.
    const exam_type = await fetchExamType(examId);
    if (!exam_type) {
      console.error("Exam type could not be determined.");
      return;
    }

    // Build complete responses: ensure every question number is included,
    // using an empty string for unanswered questions.
    const completeResponses = { ...responses };
    if (data) {
      data.questions.forEach((q) => {
        const key = q.question_number.toString();
        if (completeResponses[key] === undefined) {
          completeResponses[key] = "";
        }
      });
    }

    // Submit evaluation via POST endpoint on the reading evaluation route
    const postRes = await fetch(`/api/exams/${examId}/reading/evaluation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id,
        exam_type,
        responses: completeResponses,
      }),
    });

    if (postRes.ok) {
      // Once POST is successful, make a GET call to fetch the evaluation data
      const getRes = await fetch(`/api/exams/${examId}/reading/evaluation`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (getRes.ok) {
        const result = await getRes.json();
        setEvaluation(result);
        setExamSubmitted(true);
      } else {
        console.error("Failed to fetch evaluation", await getRes.text());
      }
    } else {
      console.error("Failed to submit evaluation", await postRes.text());
    }
  };

  // Helper: Sort passages by passage_number
  const sortedPassages = () => {
    return data ? [...data.passages].sort((a, b) => a.passage_number - b.passage_number) : [];
  };

  if (!data) {
    return <div className="bg-white min-h-screen text-black">Loading...</div>;
  }

  const passages = sortedPassages();
  const currentPassage = passages[currentPassageIndex];

  // Get questions for the current passage and determine min & max question numbers
  const questionsForPassage = data.questions.filter(
    (q) => q.passage_number === currentPassage.passage_number
  );
  const questionNumbers = questionsForPassage.map((q) => q.question_number);
  const minQuestion = Math.min(...questionNumbers);
  const maxQuestion = Math.max(...questionNumbers);

  // Filter sections for the current passage and sort by section_number
  const sectionsForPassage = data.sections
    .filter((sec) => sec.passage_number === currentPassage.passage_number)
    .sort((a, b) => a.section_number - b.section_number);

  // Sorted questions for the active passage (for individual rendering)
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
        You should spend about 20 minutes on Questions {minQuestion}-{maxQuestion}, which are based
        on Reading Passage {currentPassage.passage_number}.
      </p>
    </div>
  );

  // Render question based on section's question type using imported components.
  // Pass value and onAnswerChange so that each component updates the global responses state.
  const renderQuestion = (question: Question, section: Section) => {
    const qType = section.section_question_type;
    const questionNumber = question.question_number.toString();
    const value = responses[questionNumber] || "";
    const commonProps = {
      value,
      onAnswerChange: (val: string) => handleAnswerChange(questionNumber, val),
    };
    switch (qType) {
      case "multiple_choice":
        return <MultipleChoice question={question} {...commonProps} />;
      case "true_false_not_given":
        return <TrueFalseNotGiven question={question} {...commonProps} />;
      case "yes_no_not_given":
        return <YesNoNotGiven question={question} {...commonProps} />;
      default:
        return (
          <div className="p-4 border rounded bg-white">
            <p>[Data for {qType}]</p>
          </div>
        );
    }
  };

  // Function to render feedback for a question after evaluation is available
  const renderFeedback = (question: Question) => {
    if (!evaluation) return null;
    const userAnswer = (evaluation.responses[question.question_number.toString()] || "");
    const correct = question.correct_answer ? question.correct_answer.trim().toLowerCase() : "";
    const isCorrect = userAnswer.trim().toLowerCase() === correct;
    return (
      <div className="mt-2 flex items-center">
        {isCorrect ? (
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
        ) : (
          <XCircleIcon className="w-5 h-5 text-red-600" />
        )}
        <span className="ml-2">
          {question.question_number}. Correct Answer: {question.correct_answer}
        </span>
      </div>
    );
  };

  // Render bottom navigation: Passage Tabs & Active Passage Question Navigation
  const renderBottomNav = () => {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t">
        {/* Passage Tabs */}
        <div className="flex justify-around p-3">
          {passages.map((passage, idx) => {
            const qs = data.questions.filter(
              (q) => q.passage_number === passage.passage_number
            );
            const nums = qs.map((q) => q.question_number);
            const minQ = Math.min(...nums);
            const maxQ = Math.max(...nums);
            return (
              <button
                key={passage.id}
                onClick={() => {
                  setCurrentPassageIndex(idx);
                  // Reset scroll position of both panes
                  leftPaneRef.current?.scrollTo(0, 0);
                  rightPaneRef.current?.scrollTo(0, 0);
                }}                
                className={`px-4 py-2 rounded-lg text-base border ${
                  idx === currentPassageIndex
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black"
                }`}
              >
                Passage {passage.passage_number} (<strong>{minQ} - {maxQ}</strong> questions)
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
            <span className="text-xl font-bold">IELTSExam.ai</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {examSubmitted ? (
            <span className="text-lg font-semibold text-green-600">
              Exam Submitted
            </span>
          ) : (
            <>
              <ClockIcon className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold">{timeLeft} minutes left</span>
            </>
          )}
        </div>
        <div className="absolute right-4">
          {!examSubmitted && (
            <button
              onClick={handleSubmitTest}
              disabled={examSubmitted}
              className={`px-4 py-2 bg-blue-600 text-white rounded text-base ${
                examSubmitted ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Submit Test
            </button>
          )}
        </div>
      </header>

      {/* Evaluation Header Section */}
      {evaluation && (
        <div className="p-4 bg-blue-50 rounded-lg mx-6 mb-4 shadow-md mt-20">
          <h1 className="text-3xl font-bold text-center">Reading Evaluation</h1>
          <p className="mt-2 text-xl text-center">
            Band Score: <strong>{evaluation.band_score}</strong>
          </p>
          <p className="mt-1 text-lg text-center">
            Correct Answers: <strong>{evaluation.correct_count}</strong> out of 40
          </p>
          <h2 className="mt-4 text-xl font-semibold text-center">
            Please refer to correct answers below as it will help you improve.
          </h2>
        </div>
      )}

      {/* Spacer for Fixed Header */}
      <div className="h-20"></div>

      {/* Main Content: Two Scrollable Panes */}
      <div className="flex flex-1">
        {/* Left Pane: Passage with Default Header */}
        <div 
        ref={leftPaneRef}
        className="w-1/2 p-6 overflow-y-scroll border-r pb-32" style={{ maxHeight: "calc(100vh - 160px)" }}>
          {defaultHeader}
          <h1 className="text-3xl font-bold mb-6">{currentPassage.passage_title}</h1>
          <p className="whitespace-pre-wrap text-lg leading-relaxed">
            {currentPassage.passage_text}
          </p>
        </div>

        {/* Right Pane: Questions */}
        <div 
        ref={rightPaneRef}
        className="w-1/2 p-6 overflow-y-scroll" style={{ maxHeight: "calc(100vh - 160px)" }}>
          {sectionsForPassage.map((section) => (
            <div key={section.id} className="mb-8 border-b pb-4">
              <h2 className="text-2xl font-semibold mb-2">{section.section_header}</h2>
              <div
                className="text-gray-600 mb-4 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: section.section_instructions }}
              />

              {section.section_question_type === "summary_completion" ? (
                <>
                  <SummaryCompletion
                    section={section}
                    questions={sortedQuestions.filter(
                      (q) => q.section_number === section.section_number
                    )}
                    responses={responses}
                    onAnswerChange={handleAnswerChange}
                  />
                  {evaluation &&
                    sortedQuestions
                      .filter((q) => q.section_number === section.section_number)
                      .map((q) => (
                        <div key={`feedback-${q.id}`} className="mt-2 flex items-center">
                          {(() => {
                            const userAnswer = (evaluation.responses[q.question_number.toString()] || "");
                            const correct = q.correct_answer ? q.correct_answer.trim().toLowerCase() : "";
                            const isCorrect = userAnswer.trim().toLowerCase() === correct;
                            return isCorrect ? (
                              <CheckCircleIcon className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircleIcon className="w-5 h-5 text-red-600" />
                            );
                          })()}
                          <span className="ml-2">
                            {q.question_number}. Correct Answer: {q.correct_answer}
                          </span>
                        </div>
                      ))}
                </>
              ) : section.section_question_type === "matching_statements" ? (
                <>
                  <MatchingStatements
                    questions={sortedQuestions.filter(
                      (q) => q.section_number === section.section_number
                    )}
                    sharedOptions={section.shared_options ?? {}}
                    responses={responses}
                    onAnswerChange={handleAnswerChange}
                  />
                  {evaluation &&
                    sortedQuestions
                      .filter((q) => q.section_number === section.section_number)
                      .map((q) => (
                        <div key={`feedback-${q.id}`} className="mt-2 flex items-center">
                          {(() => {
                            const userAnswer = (evaluation.responses[q.question_number.toString()] || "");
                            const correct = q.correct_answer ? q.correct_answer.trim().toLowerCase() : "";
                            const isCorrect = userAnswer.trim().toLowerCase() === correct;
                            return isCorrect ? (
                              <CheckCircleIcon className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircleIcon className="w-5 h-5 text-red-600" />
                            );
                          })()}
                          <span className="ml-2">
                            {q.question_number}. Correct Answer: {q.correct_answer}
                          </span>
                        </div>
                      ))}
                </>
              ) : (
                // All other question types are rendered individually
                sortedQuestions
                  .filter((q) => q.section_number === section.section_number)
                  .map((question) => (
                    <div key={question.id} id={`q-${question.id}`} className="mb-6 p-4 bg-gray-50 rounded shadow-sm">
                      <p className="font-medium text-lg whitespace-pre-wrap">
                        {question.question_number}. {question.question_text}
                      </p>
                      {renderQuestion(question, section)}
                      {evaluation && renderFeedback(question)}
                    </div>
                  ))
              )}
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
