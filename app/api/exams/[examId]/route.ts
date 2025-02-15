// app/api/exams/[examId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(
  req: NextRequest,
  { params }: { params: { examId: string } }
) {
  try {
    const examId = params.examId;
    
    // Fetch exam details from the exams table using the anon client.
    const { data: exam, error } = await supabase
      .from("exams")
      .select("*")
      .eq("id", examId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json({ exam });
  } catch (error) {
    console.error("Error in GET exam details:", error);
    return NextResponse.json({ error: "Failed to fetch exam details" }, { status: 500 });
  }
}
