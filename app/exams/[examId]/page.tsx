import { useState } from "react";

export default function ExamPage({ params }: { params: { examId: string } }) {
  const { examId } = params;
  const [selectedModule, setSelectedModule] = useState("Writing");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Exam Details</h1>

      {/* Module Selection */}
      <div className="flex gap-4 mb-6">
        {["Listening", "Reading", "Writing", "Speaking"].map((module) => (
          <button
            key={module}
            className={`px-4 py-2 rounded-md ${
              selectedModule === module ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedModule(module)}
          >
            {module}
          </button>
        ))}
      </div>
    </div>
  );
}
