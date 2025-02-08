"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/app/utils/supabaseClient";

export default function WritingModule() {
  const { examId } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeTask, setActiveTask] = useState(1);
  const [answers, setAnswers] = useState({ task1: "", task2: "" });
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!examId) return;

    async function fetchQuestions() {
      const { data, error } = await supabaseClient
        .from("writing_questions")
        .select("id, content, image_url")
        .eq("exam_id", examId);

      if (!error && data) {
        setQuestions(data);
      }
    }

    fetchQuestions();
  }, [examId]);

  // Timer: decrease timeLeft each second; when 0, auto-submit the test.
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);

    const payload = {
      user_id: "c42c996c-461a-4e12-b430-9431c58e1335", // 🔹 Replace with actual logged-in user ID
      exam_id: examId,
      task_1_answer: answers.task1.trim(),
      task_2_answer: answers.task2.trim(),
      submitted_at: new Date().toISOString(),
    };

    console.log("Submitting payload:", payload); // Debugging

    try {
      const response = await fetch(`/api/exams/${examId}/writing/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        router.push(`/exams/${examId}/writing/evaluation`);
      } else {
        console.error("Evaluation failed:", result.error);
      }
    } catch (error) {
      console.error("Error submitting test:", error);
    }
};


  if (!examId) return <div className="text-red-500">Invalid Exam</div>;
  if (questions.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );

  const currentTask = questions[activeTask - 1];
  const formattedTime =
    timeLeft > 60
      ? `${Math.floor(timeLeft / 60)} min remaining`
      : `00:${timeLeft.toString().padStart(2, "0")} remaining`;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-white shadow-md">
        <h2 className="text-2xl font-bold text-black">Writing Test</h2>
        <div className="flex items-center space-x-2 bg-gray-200 px-3 py-1 rounded-full">
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-lg font-bold text-black">{formattedTime}</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTask(1)}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTask === 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            Task 1
          </button>
          <button
            onClick={() => setActiveTask(2)}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTask === 2
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            Task 2
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 p-6 bg-gray-100">
        {/* Left: Question Panel */}
        <div className="w-1/2 p-4 bg-white rounded-lg shadow-md overflow-auto">
          <h3 className="text-lg font-bold text-black mb-2">{`Task ${activeTask}`}</h3>
          <p className="text-black">{currentTask.content}</p>
          {currentTask.image_url && (
            <img
              src={currentTask.image_url}
              alt="Task Image"
              className="mt-4 rounded-lg shadow-sm"
            />
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
            disabled={submitted}
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

      {/* Submit Button */}
      <div className="p-4 bg-white shadow-md flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitted}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
}
