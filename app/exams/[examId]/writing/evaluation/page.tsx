"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabaseClient } from "@/app/utils/supabaseClient";

export default function WritingEvaluation() {
  const { examId } = useParams();
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) return;

    async function fetchEvaluation() {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from("writing_evaluations")
        .select("*")
        .eq("exam_id", examId)
        .single();

      if (!error && data) {
        setEvaluation(data);
      }
      setLoading(false);
    }

    fetchEvaluation();
  }, [examId]);

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Evaluating your writing... Please wait.</p>
        </div>
      ) : evaluation ? (
        <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Writing Evaluation</h2>
          <p className="text-gray-700 text-lg mb-2"><strong>Task 1 Band Score:</strong> {evaluation.task_1_band}</p>
          <p className="text-gray-700 text-lg mb-2"><strong>Task 2 Band Score:</strong> {evaluation.task_2_band}</p>
          <p className="text-gray-700 text-lg mb-2"><strong>Overall Band Score:</strong> {evaluation.overall_band}</p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-gray-800">Feedback:</h3>
            <p className="text-gray-700">{evaluation.feedback}</p>
          </div>
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-gray-800">Improved Response:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{evaluation.revised_response}</p>
          </div>
        </div>
      ) : (
        <p className="text-red-500 text-lg font-semibold">Error loading evaluation. Please try again.</p>
      )}
    </div>
  );
}
