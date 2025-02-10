import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(
  req: NextRequest,
  { params }: { params: { examId?: string } } // ✅ Optional to prevent runtime errors
): Promise<NextResponse> {
  const examId = params?.examId;

  if (!examId) {
    return NextResponse.json({ error: "Exam ID is required" }, { status: 400 });
  }

  try {
    // Fetch writing questions for the exam
    const { data, error } = await supabase
      .from("writing_questions")
      .select("id, content, image_url")
      .eq("exam_id", examId);

    if (error) {
      console.error("Supabase GET Error:", error.message);
      return NextResponse.json({ error: "Database error while fetching questions" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No writing questions available" }, { status: 404 });
    }

    return NextResponse.json({ questions: data });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { examId?: string } }
): Promise<NextResponse> {
  const examId = params?.examId;

  if (!examId) {
    return NextResponse.json({ error: "Exam ID is required" }, { status: 400 });
  }

  try {
    const { user_id, task_1_answer, task_2_answer, submit } = await req.json();

    if (!user_id || !task_1_answer || !task_2_answer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert writing attempt into Supabase
    const { data, error } = await supabase
      .from("writing_attempts")
      .upsert(
        {
          user_id,
          exam_id: examId,
          task_1_answer,
          task_2_answer,
          submitted_at: submit ? new Date().toISOString() : null,
        },
        { onConflict: ["user_id", "exam_id"] }
      )
      .select();

    if (error) {
      console.error("Supabase POST Error:", error.message);
      return NextResponse.json({ error: "Failed to save writing attempt" }, { status: 500 });
    }

    return NextResponse.json({ success: true, attempt: data });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
