// app/api/exams/[examId]/reading/evaluation/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";

// Academic Reading conversion (40 questions)
function calculateAcademicBand(correctCount: number): number {
  if (correctCount >= 39) return 9;
  else if (correctCount >= 37) return 8.5;
  else if (correctCount >= 35) return 8;
  else if (correctCount >= 33) return 7.5;
  else if (correctCount >= 30) return 7;
  else if (correctCount >= 27) return 6.5;
  else if (correctCount >= 23) return 6;
  else if (correctCount >= 19) return 5.5;
  else if (correctCount >= 15) return 5;
  else if (correctCount >= 13) return 4.5;
  else if (correctCount >= 10) return 4;
  else if (correctCount >= 8) return 3.5;
  else if (correctCount >= 6) return 3;
  else if (correctCount >= 4) return 2.5;
  else return 2;
}

// General Training Reading conversion (40 questions)
function calculateGeneralBand(correctCount: number): number {
  if (correctCount === 40) return 9;
  else if (correctCount === 39) return 8.5;
  else if (correctCount >= 37) return 8;
  else if (correctCount === 36) return 7.5;
  else if (correctCount >= 34) return 7;
  else if (correctCount >= 32) return 6.5;
  else if (correctCount >= 30) return 6;
  else if (correctCount >= 27) return 5.5;
  else if (correctCount >= 23) return 5;
  else if (correctCount >= 19) return 4.5;
  else if (correctCount >= 15) return 4;
  else if (correctCount >= 12) return 3.5;
  else if (correctCount >= 9) return 3;
  else if (correctCount >= 6) return 2.5;
  else return 2;
}

// POST: Submit evaluation
export async function POST(
  req: NextRequest,
  { params }: { params: { examId: string } }
) {
  try {
    const examId = params.examId;
    const { user_id, exam_type, responses } = await req.json();
    const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing Authorization Token" }, { status: 401 });
    }
    const supabaseClient = createSupabaseClient(authHeader);

    // Fetch all reading questions for the exam
    const { data: questions, error: qError } = await supabaseClient
      .from("reading_questions")
      .select("question_number, correct_answer")
      .eq("exam_id", examId);
    if (qError) {
      return NextResponse.json({ error: qError.message }, { status: 500 });
    }

    let correctCount = 0;
    if (questions) {
      for (const q of questions) {
        const qNum = q.question_number.toString();
        const userAnswer = responses[qNum];
        if (
          userAnswer &&
          q.correct_answer &&
          userAnswer.trim().toLowerCase() === q.correct_answer.trim().toLowerCase()
        ) {
          correctCount++;
        }
      }
    }

    let bandScore = exam_type === "Academic"
      ? calculateAcademicBand(correctCount)
      : calculateGeneralBand(correctCount);

    // Determine the new attempt number by fetching the latest attempt for this user and exam
    const { data: lastAttemptData, error: lastAttemptError } = await supabaseClient
      .from("reading_evaluations")
      .select("attempt_number")
      .eq("exam_id", examId)
      .eq("user_id", user_id)
      .order("attempt_number", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (lastAttemptError) {
      return NextResponse.json({ error: lastAttemptError.message }, { status: 500 });
    }

    const newAttemptNumber = lastAttemptData && lastAttemptData.attempt_number
      ? lastAttemptData.attempt_number + 1
      : 1;

    // Insert a new evaluation record with the new attempt number
    const { data: evaluation, error: evalError } = await supabaseClient
      .from("reading_evaluations")
      .insert([
        {
          user_id,
          exam_id: examId,
          responses,
          correct_count: correctCount,
          band_score: bandScore,
          attempt_number: newAttemptNumber,
          submitted_at: new Date().toISOString(),
        },
      ])
      .single();

    if (evalError) {
      console.error("Error in POST evaluation:", evalError);
      return NextResponse.json({ error: evalError.message }, { status: 500 });
    }

    // --- Insert a new record into user_exam_summary ---
    const { error: summaryInsertError } = await supabaseClient
      .from("user_exam_summary")
      .upsert([
        {
          user_id,
          exam_id: examId,
          reading_band_score: bandScore,
          last_attempt_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ], { onConflict: "user_id,exam_id" });

    if (summaryInsertError) {
      console.error("Error inserting user_exam_summary:", summaryInsertError);
    }

    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error("Error in POST evaluation:", error);
    return NextResponse.json({ error: "Failed to evaluate reading response" }, { status: 500 });
  }
}

// GET: Fetch the latest evaluation for the authenticated user
export async function GET(
  req: NextRequest,
  { params }: { params: { examId: string } }
) {
  try {
    const examId = params.examId;
    const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing Authorization Token" }, { status: 401 });
    }
    const supabaseClient = createSupabaseClient(authHeader);
    const { data: userSession, error: sessionError } = await supabaseClient.auth.getUser();
    if (sessionError || !userSession?.user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }
    const user_id = userSession.user.id;

    // Fetch the latest evaluation (ordered by attempt_number descending)
    const { data, error } = await supabaseClient
      .from("reading_evaluations")
      .select("*")
      .eq("exam_id", examId)
      .eq("user_id", user_id)
      .order("attempt_number", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Evaluation not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET evaluation:", error);
    return NextResponse.json({ error: "Failed to fetch evaluation" }, { status: 500 });
  }
}
