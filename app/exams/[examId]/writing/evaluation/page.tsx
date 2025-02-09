'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HeaderNavigation from "@/components/HeaderNavigation";

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
}

const EvalPage = () => {
  const { examId } = useParams();
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("task_1");

  useEffect(() => {
    if (!examId) {
      console.error("Error: examId is undefined!");
      return;
    }

    const fetchEvaluation = async () => {
      try {
        console.log("Fetching evaluation for examId:", examId);
        const response = await fetch(`/api/exams/${examId}/writing/evaluation?user_id=c42c996c-461a-4e12-b430-9431c58e1335`);

        if (!response.ok) throw new Error("Failed to fetch evaluation data");

        const data = await response.json();
        console.log("Fetched evaluation:", data);
        setEvaluation(data);
      } catch (error) {
        console.error("Error fetching evaluation data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [examId]);

  if (loading) {
    return <div className="text-center text-blue-500 text-lg font-semibold">Loading evaluation data...</div>;
  }

  if (!evaluation) {
    return <div className="text-center text-red-500 text-lg font-semibold">Failed to load evaluation data.</div>;
  }

  return (
    <>
      <HeaderNavigation />
      <div className="container mx-auto px-10 py-8 bg-white">
        {/* Header Section with Overall Band Score Highlight */}
      <div className="bg-blue-600 p-6 rounded-lg text-center shadow-md">
        <h2 className="text-2xl font-bold text-white">Writing Module Evaluation</h2>
        <p className="text-lg font-semibold text-white mt-2">
          <span className="text-xl font-bold">Overall Band Score:</span> <span className="text-yellow-300 text-2xl font-bold">{evaluation.overall_band}</span>
        </p>
      </div>

      {/* Info Section */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900">IELTS writing examiners evaluate an exam on the following four criteria:</h3>
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
    </div>
    </>
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

    {/* Boost Score Section */}
    <div className="mt-8 text-center">
      <h3 className="text-xl font-bold text-gray-900">Boost Your Score by Re-Writing Your Essay</h3>
    </div>

    {/* Full-Width Improved Response Section */}
    <div className="mt-6">
      <FeedbackCard title="Improved Response" content={rewrite} fullWidth />
    </div>
  </div>
);

/* Individual Feedback Cards */
const FeedbackCard = ({ title, content, fullWidth }: { title: string; content: string; fullWidth?: boolean }) => (
  <div className={`p-5 bg-white rounded-lg shadow-md border border-gray-200 transition transform hover:scale-105 ${fullWidth ? "col-span-2" : ""}`}>
    <h5 className="font-semibold text-gray-900">{title}</h5>
    <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-line">{content}</p>
  </div>
);

export default EvalPage;
