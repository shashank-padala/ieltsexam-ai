"use client";

import { useEffect, useState } from "react";
import ExamCard from "./ExamCard";
import { Exam } from "./ExamCard";
import { supabase } from "@/lib/supabaseClient";

export default function IELTSExamLibrary() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [examSummaries, setExamSummaries] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState("Academic");
  const [selectedYear, setSelectedYear] = useState("2024");

  useEffect(() => {
    async function fetchExams() {
      const res = await fetch(`/api/exams?year=${selectedYear}&type=${selectedType}`);
      const data = await res.json();
      if (!data.error) {
        setExams(data.exams);
      }
    }
    fetchExams();
  }, [selectedType, selectedYear]);

  useEffect(() => {
    async function fetchExamSummaries() {
      try {
        // Get the user's session to retrieve the access token
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        if (!token) return;
        const res = await fetch(`/api/user_exam_summary`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!data.error) {
          setExamSummaries(data);
        }
      } catch (error) {
        console.error("Error fetching exam summaries:", error);
      }
    }
    fetchExamSummaries();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">IELTS Exam Library</h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {["Academic", "General"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg ${
                  selectedType === type
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700"
          >
            <option>2024</option>
            <option>2023</option>
          </select>
        </div>
      </div>
      <div className="space-y-6">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} examSummaries={examSummaries} />
        ))}
      </div>
    </section>
  );
}
