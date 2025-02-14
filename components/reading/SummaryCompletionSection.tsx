"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

interface SummaryCompletionProps {
  section: {
    content: {
      paragraph: string;
      blanks: number[];
    };
  };
}

export default function SummaryCompletion({ section }: SummaryCompletionProps) {
  const { paragraph } = section.content || { paragraph: "", blanks: [] };

  // Split the paragraph on placeholders of the form {number}
  const parts = paragraph.split(/{\d+}/g);
  // Find all placeholder matches in the paragraph
  const placeholders = paragraph.match(/{\d+}/g) || [];

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <p className="text-lg leading-relaxed">
        {parts.map((part, i) => (
          <span key={i}>
            <span dangerouslySetInnerHTML={{ __html: part }} />
            {i < placeholders.length && (
              <>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold mx-2">
                  {placeholders[i].replace(/[{}]/g, "")}
                </span>
                <input
                  type="text"
                  className="border-2 border-blue-500 rounded-md px-3 py-1 w-32 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </>
            )}
          </span>
        ))}
      </p>
    </div>
  );
}
