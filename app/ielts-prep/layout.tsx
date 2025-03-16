// app/ielts-prep/layout.tsx
import React from 'react';
import { Metadata } from 'next';
import '../globals.css'; 
import Sidebar from '@/components/ielts-prep/Sidebar';


export const metadata: Metadata = {
  title: 'IELTS Exam Prep',
  description: 'Structured layout with header, sidebar, and module progress',
};

export default function IELTSPrepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">

      {/* Main container: Sidebar + Content */}
      <div className="flex flex-1">
        {/* Left sidebar (client component) */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 p-8 border-l border-gray-200 overflow-auto">
          {/* Constrain width for better readability */}
          <div className="max-w-3xl mx-auto leading-relaxed">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
