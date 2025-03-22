import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";


export async function GET(
  request: NextRequest,
  { params }: { params: { examId: string } }
): Promise<NextResponse> {
  const { examId } = params;
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
