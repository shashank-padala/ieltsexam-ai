// app/api/exams/[examId]/speaking/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

interface Params {
  examId: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { examId } = params;
  if (!examId) {
    return NextResponse.json({ error: "exam_id is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("speaking_questions")
    .select("id, part_number, question_text, cue_card_text, question_type")
    .eq("exam_id", examId)
    .order("part_number", { ascending: true });

  if (error) {
    console.error("Supabase error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const groupedQuestions = data.reduce((acc: Record<number, any[]>, question) => {
    if (!acc[question.part_number]) {
      acc[question.part_number] = [];
    }
    acc[question.part_number].push({
      id: question.id,
      question_text: question.question_text,
      cue_card_text: question.cue_card_text, // Include cue card text for Part 2
      question_type: question.question_type, // Ensure question type is used
    });
    return acc;
  }, {});

  return NextResponse.json(groupedQuestions);
}
