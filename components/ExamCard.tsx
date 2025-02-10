"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase
import {
  PlayIcon,
  MusicalNoteIcon,
  BookOpenIcon,
  PencilSquareIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/solid";
import { User } from '@supabase/supabase-js';

interface ModuleType {
  name: "Listening" | "Reading" | "Writing" | "Speaking";
  icon: React.ElementType;
  duration: number;
}

interface Exam {
  id: string;
  title: string;
  type: "Academic" | "General";
  year: number;
}

const defaultModules: ModuleType[] = [
  { name: "Listening", icon: MusicalNoteIcon, duration: 30 },
  { name: "Reading", icon: BookOpenIcon, duration: 60 },
  { name: "Writing", icon: PencilSquareIcon, duration: 60 },
  { name: "Speaking", icon: MicrophoneIcon, duration: 15 },
];

export default function ExamCard({ exam }: { exam: Exam}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingModule, setLoadingModule] = useState<string | null>(null);
  const [tooltipModule, setTooltipModule] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleModuleClick = async (moduleName: string) => {
    if (!user) {
      router.push("/login"); // Redirect to login if not logged in
      return;
    }

    setLoadingModule(moduleName);
    setTooltipModule(null);

    try {
      const response = await fetch(`/api/exams/${exam.id}/${moduleName.toLowerCase()}`);

      if (response.status === 404) {
        setTooltipModule(moduleName); // ❌ No questions → Show tooltip
      } else if (response.ok) {
        router.push(`/exams/${exam.id}/${moduleName.toLowerCase()}`); // ✅ Navigate to test page
      } else {
        console.error(`Unexpected error for ${moduleName}:`, response.statusText);
        setTooltipModule(moduleName);
      }
    } catch (error) {
      console.error(`Error checking availability for ${moduleName}:`, error);
      setTooltipModule(moduleName);
    }

    setLoadingModule(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
      {/* Exam Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-gray-900">{exam.title}</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              exam.type === "Academic"
                ? "bg-blue-100 text-blue-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {exam.type}
          </span>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {defaultModules.map((module) => {
          const Icon = module.icon;

          return (
            <div key={module.name} className="flex items-center justify-between p-4 rounded-lg bg-gray-100">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-700" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{module.name}</div>
                  <div className="text-xs text-gray-500">{module.duration}m</div>
                </div>
              </div>

              <div className="relative group">
                <button
                  className="flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium text-blue-600 hover:text-blue-700"
                  onClick={() => handleModuleClick(module.name)}
                  disabled={loadingModule === module.name}
                >
                  {loadingModule === module.name ? (
                    <span>Checking...</span>
                  ) : (
                    <>
                      <PlayIcon className="w-4 h-4" />
                      Take Test
                    </>
                  )}
                </button>

                {tooltipModule === module.name && (
                  <div className="absolute bottom-8 left-0 w-max bg-gray-800 text-white text-xs px-3 py-1 rounded-md opacity-100">
                    This module is not available yet.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
