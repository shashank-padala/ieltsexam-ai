"use client";

import { useState } from "react";
import TestCard from "./TestCard";

export default function MockTests() {
  const [selectedType, setSelectedType] = useState<"Academic" | "General">(
    "Academic"
  );
  const [selectedYear, setSelectedYear] = useState("2024");

  // Generate monthly tests for selected year
  const mockTests = Array.from({ length: 12 }).map((_, index) => {
    const randomScores = {
      overall: Math.random() * 9 * (index % 3 === 0 ? 1 : 0), // 33% chance of being attempted
      Listening: Math.random() * 9 * (index % 4 === 0 ? 1 : 0),
      Reading: Math.random() * 9 * (index % 5 === 0 ? 1 : 0),
      Writing: Math.random() * 9 * (index % 3 === 0 ? 1 : 0),
      Speaking: Math.random() * 9 * (index % 2 === 0 ? 1 : 0),
    };

    return {
      id: index + 1,
      type: selectedType,
      title: `${new Date(Number(selectedYear), index).toLocaleString(
        "default",
        { month: "short" }
      )} ${selectedYear} IELTS Exam`,
      modules: ["Listening", "Reading", "Writing", "Speaking"],
      attempts: `${Math.floor(Math.random() * 90000 + 10000)}`,
      scores: randomScores,
    };
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
    <h2 className="text-2xl font-bold text-gray-900">IELTS Exam Library</h2>
    
    <div className="flex items-center gap-4">
      {/* Type Tabs */}
      <div className="flex gap-2">
        {['Academic', 'General'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type as 'Academic' | 'General')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === type 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Year Selector */}
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
      {/* Test Cards Grid */}
      <div className="space-y-6">
        {mockTests
          .filter((test) => test.type === selectedType)
          .map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
      </div>
    </section>
  );
}
