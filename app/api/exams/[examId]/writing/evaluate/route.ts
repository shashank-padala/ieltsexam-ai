import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@/app/utils/supabaseClient";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest, { params }: { params: { examId: string } }) {
  try {
    const { examId } = params;
    const { user_id, task_1_answer, task_2_answer } = await req.json();

    if (!user_id || !task_1_answer || !task_2_answer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Construct OpenAI prompt
    const prompt = `
      You are an IELTS writing evaluator. Evaluate the following two writing tasks, provide band scores (0-9), feedback, and a rewritten response to improve the score.

      Task 1 Response:
      ${task_1_answer}

      Task 2 Response:
      ${task_2_answer}

      Provide output in JSON format:
      {
        "task_1_band": (band score),
        "task_2_band": (band score),
        "overall_band": (average score rounded to nearest 0.5),
        "task_1_feedback": "(feedback)",
        "task_2_feedback": "(feedback)",
        "task_1_rewrite": "(rewritten response)",
        "task_2_rewrite": "(rewritten response)"
      }
    `;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.7,
    });

    const evaluation = JSON.parse(aiResponse.choices[0]?.message?.content || "{}");

    // Store evaluation in `writing_evaluations` table
    const { error } = await supabaseClient.from("writing_evaluations").insert([
      {
        user_id,
        exam_id: examId,
        task_1_band: evaluation.task_1_band,
        task_2_band: evaluation.task_2_band,
        overall_band: evaluation.overall_band,
        task_1_feedback: evaluation.task_1_feedback,
        task_2_feedback: evaluation.task_2_feedback,
        task_1_rewrite: evaluation.task_1_rewrite,
        task_2_rewrite: evaluation.task_2_rewrite,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, evaluation });
  } catch (error) {
    return NextResponse.json({ error: "Failed to evaluate writing response" }, { status: 500 });
  }
}
