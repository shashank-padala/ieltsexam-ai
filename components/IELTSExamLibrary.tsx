"use client";

import { useEffect, useState } from "react";
import ExamCard from "./ExamCard";

export default function IELTSExamLibrary() {
  const [exams, setExams] = useState([]);
  const [moduleAvailability, setModuleAvailability] = useState({});
  const [selectedType, setSelectedType] = useState("Academic");
  const [selectedYear, setSelectedYear] = useState("2024");

  useEffect(() => {
    async function fetchExams() {
      const res = await fetch(`/api/exams?year=${selectedYear}&type=${selectedType}`);
      const data = await res.json();
      
      if (!data.error) {
        setExams(data.exams);
        setModuleAvailability(data.moduleAvailability);
      }
    }
    fetchExams();
  }, [selectedType, selectedYear]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">IELTS Exam Library</h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {["Academic", "General"].map((type) => (
              <button key={type} onClick={() => setSelectedType(type)} className={`px-4 py-2 rounded-lg ${selectedType === type ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}>
                {type}
              </button>
            ))}
          </div>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700">
            <option>2024</option>
            <option>2023</option>
          </select>
        </div>
      </div>
      <div className="space-y-6">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} moduleAvailability={moduleAvailability} />
        ))}
      </div>
    </section>
  );
}
