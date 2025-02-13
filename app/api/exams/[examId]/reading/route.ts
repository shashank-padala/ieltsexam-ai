// app/api/exams/[examId]/reading/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: Request,
  { params }: { params: { examId: string } }
) {
  const examId = params.examId;

  // Fetch all passages for this exam
  const { data: passages, error: passageError } = await supabase
    .from('reading_passages')
    .select('*')
    .eq('exam_id', examId);

  if (passageError) {
    return NextResponse.json(
      { error: passageError.message },
      { status: 500 }
    );
  }

  // Fetch all sections for this exam
  const { data: sections, error: sectionError } = await supabase
    .from('reading_sections')
    .select('*')
    .eq('exam_id', examId);

  if (sectionError) {
    return NextResponse.json(
      { error: sectionError.message },
      { status: 500 }
    );
  }

  // Fetch all questions for this exam
  const { data: questions, error: questionError } = await supabase
    .from('reading_questions')
    .select('*')
    .eq('exam_id', examId);

  if (questionError) {
    return NextResponse.json(
      { error: questionError.message },
      { status: 500 }
    );
  }

  // Return a combined JSON response. The front-end can group sections and questions as needed.
  return NextResponse.json({
    passages,
    sections,
    questions,
  });
}
