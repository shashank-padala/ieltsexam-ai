'use client';

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface Feedback {
  task_response: string;
  coherence_cohesion: string;
  grammatical_accuracy: string;
  lexical_resource: string;
}

interface EvaluationData {
  task_1_band: number;
  task_2_band: number;
  overall_band: number;
  task_1_feedback: Feedback;
  task_2_feedback: Feedback;
  task_1_rewrite: string;
  task_2_rewrite: string;
  task_1_answer: string; // Candidate's original answer for Task 1
  task_2_answer: string; // Candidate's original answer for Task 2
}

const EvalPage = () => {
  const { examId } = useParams();
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("task_1");

  // Check if any task's band score is 0
  const evaluationFailed =
    evaluation && (evaluation.task_1_band === 0 || evaluation.task_2_band === 0);

  // Function to fetch evaluation data from API
  const fetchEvaluation = useCallback(async () => {
    if (!examId) return;
    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        console.error("User session is invalid or expired", sessionError);
        setLoading(false);
        return;
      }
      
      const token = sessionData.session.access_token;
      if (!token) {
        console.error("Failed to retrieve authentication token");
        setLoading(false);
        return;
      }
      
      const response = await fetch(`/api/exams/${examId}/writing/evaluation`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (Status: ${response.status}):`, errorText);
        throw new Error("Failed to fetch evaluation data");
      }
  
      const dataJson = await response.json();
      setEvaluation(dataJson);
    } catch (error) {
      console.error("Error fetching evaluation data:", error);
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    fetchEvaluation();
  }, [fetchEvaluation, examId]);
  
  // Function to resubmit evaluation if previous evaluation failed
  const handleResubmitEvaluation = async () => {
    if (!examId || !evaluation) return;
    setLoading(true);
    try {
      // Fetch the writing questions to get the original task questions
      const { data: questionsData, error: questionsError } = await supabase
        .from("writing_questions")
        .select("task_number, content")
        .eq("exam_id", examId);
      if (questionsError || !questionsData) {
        console.error("Error fetching questions", questionsError);
        setLoading(false);
        return;
      }
      const task1Question = questionsData.find((q: any) => q.task_number === 1)?.content || "";
      const task2Question = questionsData.find((q: any) => q.task_number === 2)?.content || "";
      
      // Use the candidate answers stored in evaluation record (fallback value)
      const payload = {
        task_1_question: task1Question,
        task_2_question: task2Question,
        task_1_answer: evaluation.task_1_answer,
        task_2_answer: evaluation.task_2_answer,
      };
  
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        console.error("Missing authentication token");
        setLoading(false);
        return;
      }
  
      const response = await fetch(`/api/exams/${examId}/writing/evaluation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        console.error("Failed to resubmit evaluation");
        setLoading(false);
        return;
      }
      // On successful re-evaluation, re-fetch evaluation data
      await fetchEvaluation();
    } catch (error) {
      console.error("Error in resubmitting evaluation:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-blue-500 text-lg font-semibold">
        Loading evaluation data...
      </div>
    );
  }
  
  if (!evaluation) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold">
        Failed to load evaluation data.
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-10 py-8 bg-white">
      {/* Header Section with Overall Band Score Highlight */}
      <div className="bg-blue-600 p-6 rounded-lg text-center shadow-md">
        <h2 className="text-2xl font-bold text-white">Writing Module Evaluation</h2>
        <p className="text-lg font-semibold text-white mt-2">
          <span className="text-xl font-bold">Overall Band Score:</span>{" "}
          <span className="text-yellow-300 text-2xl font-bold">{evaluation.overall_band}</span>
        </p>
      </div>

      {/* Info Section */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900">
          IELTS writing examiners evaluate an exam on the following four criteria:
        </h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex mt-6 space-x-4 justify-center">
        <button
          className={`px-6 py-2 text-lg font-semibold rounded-lg transition ${
            activeTab === "task_1"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
          }`}
          onClick={() => setActiveTab("task_1")}
        >
          Task 1
        </button>
        <button
          className={`px-6 py-2 text-lg font-semibold rounded-lg transition ${
            activeTab === "task_2"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
          }`}
          onClick={() => setActiveTab("task_2")}
        >
          Task 2
        </button>
      </div>

      {/* Feedback Section */}
      <div className="mt-6">
        {activeTab === "task_1" ? (
          <FeedbackSection
            feedback={evaluation.task_1_feedback}
            band={evaluation.task_1_band}
            rewrite={evaluation.task_1_rewrite}
          />
        ) : (
          <FeedbackSection
            feedback={evaluation.task_2_feedback}
            band={evaluation.task_2_band}
            rewrite={evaluation.task_2_rewrite}
          />
        )}
      </div>

      {/* Response Comparison Section */}
      {activeTab === "task_1" && (
        <ResponseComparison
          original={evaluation.task_1_answer}
          improved={evaluation.task_1_rewrite}
        />
      )}
      {activeTab === "task_2" && (
        <ResponseComparison
          original={evaluation.task_2_answer}
          improved={evaluation.task_2_rewrite}
        />
      )}

      {/* Resubmit Button if Evaluation Failed */}
      {evaluationFailed && (
        <div className="mt-6 text-center">
          <button
            onClick={handleResubmitEvaluation}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Resubmit Evaluation
          </button>
        </div>
      )}
    </div>
  );
};

/* Feedback Section */
const FeedbackSection = ({
  feedback,
  band,
  rewrite,
}: {
  feedback: Feedback;
  band: number;
  rewrite: string;
}) => (
  <div className="p-6 bg-gray-100 rounded-lg shadow-md mt-6">
    <h4 className="text-xl font-bold text-gray-900">
      Band Score: <span className="text-blue-600">{band}</span>
    </h4>

    {/* 4 Criteria Cards in Grid Layout */}
    <div className="grid grid-cols-2 gap-6 mt-6">
      <FeedbackCard title="Task Response" content={feedback.task_response} />
      <FeedbackCard title="Coherence and Cohesion" content={feedback.coherence_cohesion} />
      <FeedbackCard title="Grammatical Range and Accuracy" content={feedback.grammatical_accuracy} />
      <FeedbackCard title="Lexical Resource" content={feedback.lexical_resource} />
    </div>
  </div>
);

/* Individual Feedback Cards */
const FeedbackCard = ({
  title,
  content,
  fullWidth,
}: {
  title: string;
  content: string;
  fullWidth?: boolean;
}) => (
  <div
    className={`p-5 bg-white rounded-lg shadow-md border border-gray-200 transition transform hover:scale-105 ${
      fullWidth ? "col-span-2" : ""
    }`}
  >
    <h5 className="font-semibold text-gray-900">{title}</h5>
    <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-line">{content}</p>
  </div>
);

/* Response Comparison Section */
const ResponseComparison = ({
  original,
  improved,
}: {
  original: string;
  improved: string;
}) => (
  <div className="mt-8">
    <h3 className="text-xl font-bold text-gray-900 text-center mb-4">Response Comparison</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 bg-gray-100 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-gray-900">Your Original Response</h4>
        <p className="mt-3 text-gray-700 whitespace-pre-line">{original}</p>
      </div>
      <div className="p-6 bg-gray-100 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-gray-900">AI Improved Response</h4>
        <p className="mt-3 text-gray-700 whitespace-pre-line">{improved}</p>
      </div>
    </div>
  </div>
);

export default EvalPage;
