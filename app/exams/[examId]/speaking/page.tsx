"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Question {
  id: string;
  question_text: string;
  cue_card_text?: string;
  question_type: "short" | "cue_card" | "discussion";
}

// Time estimates for display purposes
const partTimes: { [key: number]: string } = {
  1: "4-5 minutes",
  2: "3-4 minutes",
  3: "4-5 minutes",
};

export default function SpeakingPage() {
  const { examId } = useParams();
  // Global state
  const [questions, setQuestions] = useState<{ [key: number]: Question[] }>({});
  const [currentPart, setCurrentPart] = useState(1); // 1 = Part 1, 2 = Part 2, 3 = Part 3
  const [examFinished, setExamFinished] = useState(false);

  // -------------------
  // Part 1 State
  // -------------------
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timers, setTimers] = useState<number[]>([]);
  const [completedQuestions, setCompletedQuestions] = useState<boolean[]>([]);

  // -------------------
  // Part 2 State
  // -------------------
  // When Part 2 begins, we start with 60s prep time then 120s speaking time.
  const [isPart2Prep, setIsPart2Prep] = useState(true);
  const [part2PrepTime, setPart2PrepTime] = useState(60);
  const [part2SpeakingTime, setPart2SpeakingTime] = useState(120);

  // -------------------
  // Part 3 State
  // -------------------
  const [part3Index, setPart3Index] = useState(0);
  const [part3Timers, setPart3Timers] = useState<number[]>([]);
  const [part3Completed, setPart3Completed] = useState<boolean[]>([]);

  // -------------------
  // Fetch questions & initialize Part 1 state
  // -------------------
  useEffect(() => {
    if (!examId) return;
    fetch(`/api/exams/${examId}/speaking/`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        if (data[1]) {
          setTimers(Array(data[1].length).fill(30));
          setCompletedQuestions(Array(data[1].length).fill(false));
        }
      })
      .catch((err) => console.error(err));
  }, [examId]);

  // -------------------
  // Timer for Part 1 (per question 30s)
  // -------------------
  useEffect(() => {
    if (currentPart === 1 && questions[1] && !examFinished) {
      const interval = setInterval(() => {
        setTimers((prevTimers) => {
          const updatedTimers = [...prevTimers];
          if (updatedTimers[currentIndex] > 0) {
            updatedTimers[currentIndex] -= 1;
          } else {
            // Mark the current question as complete
            setCompletedQuestions((prev) => {
              const newCompleted = [...prev];
              newCompleted[currentIndex] = true;
              return newCompleted;
            });
            if (currentIndex < questions[1].length - 1) {
              setCurrentIndex(currentIndex + 1);
            } else {
              // End of Part 1: switch to Part 2
              setCurrentPart(2);
              setCurrentIndex(0);
              // Initialize Part 2 state
              setIsPart2Prep(true);
              setPart2PrepTime(60);
              setPart2SpeakingTime(120);
            }
          }
          return updatedTimers;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentPart, questions, currentIndex, examFinished]);

  // -------------------
  // Timer for Part 2 (first 60s prep then 120s speaking)
  // -------------------
  useEffect(() => {
    if (currentPart === 2 && !examFinished) {
      let interval: NodeJS.Timeout;
      if (isPart2Prep) {
        interval = setInterval(() => {
          setPart2PrepTime((prev) => {
            if (prev > 0) return prev - 1;
            else {
              clearInterval(interval);
              setIsPart2Prep(false);
              return 0;
            }
          });
        }, 1000);
      } else {
        // Speaking phase timer (120 seconds)
        interval = setInterval(() => {
          setPart2SpeakingTime((prev) => {
            if (prev > 0) return prev - 1;
            else {
              clearInterval(interval);
              // When speaking phase is over, switch to Part 3.
              setCurrentPart(3);
              // Initialize Part 3 state if questions[3] exists.
              if (questions[3]) {
                setPart3Index(0);
                setPart3Timers(Array(questions[3].length).fill(30));
                setPart3Completed(Array(questions[3].length).fill(false));
              }
              return 0;
            }
          });
        }, 1000);
      }
      return () => clearInterval(interval);
    }
  }, [currentPart, isPart2Prep, examFinished, questions]);

  // -------------------
  // Timer for Part 3 (per question 30s)
  // -------------------
  useEffect(() => {
    if (currentPart === 3 && questions[3] && !examFinished) {
      const interval = setInterval(() => {
        setPart3Timers((prevTimers) => {
          const updatedTimers = [...prevTimers];
          if (updatedTimers[part3Index] > 0) {
            updatedTimers[part3Index] -= 1;
          } else {
            // Mark the current Part 3 question as complete.
            setPart3Completed((prev) => {
              const newCompleted = [...prev];
              newCompleted[part3Index] = true;
              return newCompleted;
            });
            if (part3Index < questions[3].length - 1) {
              setPart3Index(part3Index + 1);
            } else {
              // End of Part 3: finish exam.
              finishExam();
            }
          }
          return updatedTimers;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentPart, questions, part3Index, examFinished]);

  // -------------------
  // Finish exam function
  // -------------------
  const finishExam = () => {
    setExamFinished(true);
  };

  // -------------------
  // Render
  // -------------------
  return (
    <div className="container mx-auto p-6 bg-[#f8f9fc] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1e1e1e]">IELTS Speaking Test</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-[#3366FF] text-white rounded-lg shadow-md hover:bg-[#254edb]"
        >
          Back to Home
        </Link>
      </div>

      {/* IELTS Speaking Test Format */}
      <div className="bg-white p-5 rounded-lg shadow-md border mb-6">
        <h2 className="text-xl font-semibold text-[#1e1e1e] mb-4">
          ✅ IELTS Speaking Test Format
        </h2>
        <div className="space-y-4 text-[#1e1e1e]">
          <div>
            <h3 className="text-lg font-semibold">Part 1 (Introduction & Interview : 4-5 mins)</h3>
            <ul className="list-disc pl-5 text-md text-[#555]">
              <li>Examiner asks basic personal questions about home, studies, hobbies, work, etc.</li>
              <li>Multiple short-answer questions (4-6 questions in total).</li>
              <li>Conversational and introductory.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Part 2 (Long Turn : 3-4 mins)</h3>
            <ul className="list-disc pl-5 text-md text-[#555]">
              <li>Candidate gets a cue card (task) with a topic.</li>
              <li>60 seconds to prepare (Prep Time) then 120 seconds to speak (Speaking Time).</li>
              <li>Examiner may ask 1-2 follow-up questions.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Part 3 (Discussion : 4-5 mins)</h3>
            <ul className="list-disc pl-5 text-md text-[#555]">
              <li>Extended discussion on the Part 2 topic.</li>
              <li>Examiner asks opinion-based or abstract questions.</li>
              <li>Each question is timed (30 seconds each) with visual indicators.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Estimated Time */}
      <div className="bg-white p-4 rounded-lg shadow-md border mb-6">
        <h2 className="text-lg font-semibold text-[#1e1e1e]">
          Total Estimated Time: ~11-14 minutes
        </h2>
      </div>

      {/* Display All Parts */}
      {Object.entries(questions).map(([part, qs]) => (
        <div key={part} className="bg-white p-5 rounded-lg shadow-md border mb-6">
          <h2 className="text-2xl font-semibold text-[#1e1e1e] mb-4">
            Part {part} <span className="text-[#555] text-lg">(~{partTimes[Number(part)]})</span>
          </h2>

          {/* Part 2 Timer Display */}
          {Number(part) === 2 && currentPart === 2 && (
            <p className="text-md text-red-500 mt-1">
              {isPart2Prep
                ? `⏳ ${part2PrepTime}s (Prep Time)`
                : `⏳ ${part2SpeakingTime}s (Speaking Time)`}
            </p>
          )}

          <ul className="space-y-4">
            {qs.map((q, index) => (
              <li key={q.id} className="p-4 border rounded-lg shadow-sm bg-[#f0f4ff]">
                {/* Part 1 Dot & Timer */}
                {Number(part) === 1 && (
                  <div className="flex items-center space-x-2 mb-1">
                    {currentPart === 1 ? (
                      index === currentIndex ? (
                        <>
                          <span className="w-3 h-3 bg-green-500 rounded-full" />
                          <p className="text-md text-red-500">⏳ {timers[index]}s</p>
                        </>
                      ) : completedQuestions[index] ? (
                        <span className="w-3 h-3 bg-blue-500 rounded-full" />
                      ) : (
                        <span className="w-3 h-3 bg-gray-300 rounded-full" />
                      )
                    ) : (
                      // When Part 1 is over, all questions show a blue dot.
                      <span className="w-3 h-3 bg-blue-500 rounded-full" />
                    )}
                  </div>
                )}

                {/* Part 3 Dot & Timer */}
                {Number(part) === 3 && (
                  <div className="flex items-center space-x-2 mb-1">
                    {currentPart === 3 ? (
                      index === part3Index ? (
                        <>
                          <span className="w-3 h-3 bg-green-500 rounded-full" />
                          <p className="text-md text-red-500">⏳ {part3Timers[index]}s</p>
                        </>
                      ) : part3Completed[index] ? (
                        <span className="w-3 h-3 bg-blue-500 rounded-full" />
                      ) : (
                        <span className="w-3 h-3 bg-gray-300 rounded-full" />
                      )
                    ) : (
                      <span className="w-3 h-3 bg-blue-500 rounded-full" />
                    )}
                  </div>
                )}

                {/* Render question text and cue card text */}
                <p className="text-lg font-semibold text-[#1e1e1e]">🎤 {q.question_text}</p>
                {q.cue_card_text && Number(part) === 2 && (
                  <div className="mt-2 text-md text-[#555] whitespace-pre-line">
                    {q.cue_card_text}
                  </div>
                )}
                {/* (For Part 3, you can also render any extra info if needed) */}
              </li>
            ))}
          </ul>

          {/* Disclaimer for Part 2 */}
          {Number(part) === 2 && (
            <p className="mt-4 text-sm text-gray-600">
              Note: In the actual exam, a cue card is provided. You will get 1 minute to prepare before you speak for 2-3 minutes on the topic.
            </p>
          )}
        </div>
      ))}

      {/* Exam Completion */}
      {examFinished ? (
        <div className="text-center mt-6">
          <h2 className="text-xl font-semibold text-[#1e1e1e]">✅ Test Completed!</h2>
          <Link
            href="/"
            className="mt-4 px-6 py-3 bg-[#3366FF] text-white rounded-lg shadow-md hover:bg-[#254edb] inline-block"
          >
            Go Back to Home
          </Link>
        </div>
      ) : (
        <button
          onClick={finishExam}
          className="mt-6 px-6 py-3 bg-[#ff4444] text-white rounded-lg shadow-md hover:bg-[#cc0000] mx-auto block"
        >
          End Test
        </button>
      )}
    </div>
  );
}
