"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { ClockIcon, BookOpenIcon } from "@heroicons/react/24/solid";

interface WritingQuestion {
  id: string;
  task_number: number;
  content: string;
  image_url?: string;
}

export default function WritingModule() {
  const { examId } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<WritingQuestion[]>([]);
  const [activeTask, setActiveTask] = useState(1);
  const [answers, setAnswers] = useState({ task1: "", task2: "" });
  const [timeLeft, setTimeLeft] = useState(60); // minutes left
  const timerRef = useRef<NodeJS.Timeout>();
  const [user, setUser] = useState<User | null>(null);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [LoaderMessage, setLoaderMessage] = useState("Your writing exam is being evaluated using AI powered evaluator. Please wait up to 30 seconds.");
  const [evaluationFailed, setEvaluationFailed] = useState(false);

  // Fetch user session
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) {
        router.push("/login");
      } else {
        setUser(data.session.user);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [router]);

  // Fetch questions
  useEffect(() => {
    if (!examId) return;

    async function fetchQuestions() {
      const { data, error } = await supabase
        .from("writing_questions")
        .select("id, task_number, content, image_url")
        .eq("exam_id", examId);

      if (!error && data) {
        setQuestions(data);
      }
    }

    fetchQuestions();
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

  const handleSubmitTest = async () => {
    if (examSubmitted) return; // Prevent multiple submissions
    setExamSubmitted(true);
    setIsEvaluating(true);
    setEvaluationFailed(false);

    // Get the current session to extract the fresh token
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;

    if (!token) {
      console.error("Missing authentication token");
      return;
    }

    const payload = {
      task_1_question: questions.find((question) => question.task_number === 1)?.content || "",
      task_2_question: questions.find((question) => question.task_number === 2)?.content || "",
      task_1_answer: answers.task1.trim(),
      task_2_answer: answers.task2.trim(),
    };

    try {
      const response = await fetch(`/api/exams/${examId}/writing/evaluation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // token sent to API
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        if (result.evaluation_failed) {
          // Evaluation call failed but we still saved data.
          setLoaderMessage("Evaluation failed. Please try again or return to the home page.");
          setEvaluationFailed(true);
          setIsEvaluating(false);
        } else {
            setIsEvaluating(false);
            router.push(`/exams/${examId}/writing/evaluation`);
          }
        } else {
          setLoaderMessage("Evaluation failed. Please try again or return to the home page.");
          console.error("Evaluation failed:", result.error);
        }
      } catch (error) {
        setLoaderMessage("Evaluation failed. Please try again or return to the home page.");
        console.error("Error submitting test:", error);
      }
  };

  if (!examId) return <div className="text-red-500">Invalid Exam</div>;
  if (!user) return <div className="flex justify-center items-center h-screen text-xl">Checking authentication...</div>;
  if (questions.length === 0)
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;

  const currentTask = questions.find((question) => question.task_number === activeTask);

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

      {/* Spacer for Fixed Header */}
      <div className="h-10"></div>

      {/* Main Content Area */}
      <div className="flex flex-1 p-6 bg-gray-100">
        {/* Left: Question Panel */}
        <div className="w-1/2 p-4 bg-white rounded-lg shadow-md overflow-auto">
          <h3 className="text-xl font-bold text-black mb-2">{`Writing Task ${activeTask}`}</h3>
          <p className="text-black whitespace-pre-line">{currentTask?.content}</p>
          {currentTask?.image_url && (
            <img src={currentTask.image_url} alt="Task Image" className="mt-4 rounded-lg shadow-sm" />
          )}
        </div>

        {/* Right: Answer Panel */}
        <div className="w-1/2 p-4 flex flex-col bg-white rounded-lg shadow-md">
          <textarea
            className="w-full flex-1 border p-4 rounded-lg focus:ring focus:ring-blue-300 overflow-auto text-black"
            placeholder={`Write your answer for Task ${activeTask} here...`}
            value={activeTask === 1 ? answers.task1 : answers.task2}
            onChange={(e) =>
              setAnswers((prev) => ({
                ...prev,
                [activeTask === 1 ? "task1" : "task2"]: e.target.value,
              }))
            }
          ></textarea>
          <div className="flex justify-between mt-2 text-gray-800">
            <span>
              Word Count:{" "}
              {activeTask === 1
                ? answers.task1.split(" ").filter(Boolean).length
                : answers.task2.split(" ").filter(Boolean).length}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 bg-white shadow-md flex justify-end gap-4">
        <button
          onClick={() => setActiveTask(1)}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            activeTask === 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
          }`}
        >
          Task 1
        </button>
        <button
          onClick={() => setActiveTask(2)}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            activeTask === 2 ? "bg-green-600 text-white" : "bg-gray-200 text-black"
          }`}
        >
          Task 2
        </button>
      </div>

      {/* Intermediate Evaluation Modal - Loading Spinner */}
      {isEvaluating && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-4">
            <p className="text-lg mb-4">{LoaderMessage}</p>
            <div className="flex justify-center items-center">
              <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
