// components/ielts-prep/Sidebar.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const modules = [
    { label: 'Exam Overview', href: '/ielts-prep/exam-overview', completion: 40 },
    { label: 'Preparation Timeline', href: '/ielts-prep/preparation-timeline', completion: 20 },
    { label: 'Listening', href: '/ielts-prep/listening', completion: 0 },
    { label: 'Reading', href: '/ielts-prep/reading', completion: 0 },
    { label: 'Writing', href: '/ielts-prep/writing', completion: 0 },
    { label: 'Speaking', href: '/ielts-prep/speaking', completion: 0 },
    { label: 'Mock Exams', href: '/ielts-prep/mock-exams', completion: 0 },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6">IELTS Prep Navigation</h2>

      <nav className="space-y-4">
        {modules.map((module) => (
          <ModuleLink
            key={module.href}
            label={module.label}
            href={module.href}
            completion={module.completion}
            active={pathname === module.href}
          />
        ))}
      </nav>
    </aside>
  );
}

function ModuleLink({
  label,
  href,
  completion,
  active,
}: {
  label: string;
  href: string;
  completion: number;
  active: boolean;
}) {
  return (
    <a
      href={href}
      className={`block rounded-md p-3 transition-colors duration-200 ${
        active
          ? 'bg-blue-50 border-l-4 border-blue-600'
          : 'hover:bg-gray-100 hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between mb-1">
        <span
          className={`text-sm font-medium ${
            active ? 'text-blue-700' : 'text-gray-700'
          }`}
        >
          {label}
        </span>
        <span className="text-sm text-gray-600">{completion}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${completion}%` }}
        />
      </div>
    </a>
  );
}
