import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function evaluateTask(taskAnswer: string, taskNumber: number, taskQuestion: string) {
  const prompt = `
  You are an IELTS writing evaluator. Evaluate the following writing task based on IELTS criteria:
  - Task Response
  - Coherence and Cohesion
  - Grammatical Range and Accuracy
  - Lexical Resource

  Provide a band score (0-9) and detailed feedback. Also, suggest an improved response. **Ensure your output is strictly valid JSON that can be parsed by JSON.parse in JavaScript. Do not include any markdown formatting, code fences, or additional commentary.** Output only a single JSON object that follows this exact structure:

  {
    "band": <band score as a number>,
    "feedback": {
      "task_response": "<feedback for Task Response>",
      "coherence_cohesion": "<feedback for Coherence and Cohesion>",
      "grammatical_accuracy": "<feedback for Grammar and Accuracy>",
      "lexical_resource": "<feedback for Lexical Resource>"
    },
    "improved_response": "<Rewrite the user's response to improve it to get a higher band score. If your improved response contains multiple paragraphs, separate them with \\n\\n>"
  }

  IELTS Writing Task ${taskNumber}
  Question: ${taskQuestion}
  Response: ${taskAnswer}
  `;

  const aiResponse = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "system", content: prompt }],
    temperature: 0.7,
  });
  
  return JSON.parse(aiResponse.choices[0]?.message?.content || "{}");
}

export async function POST(req: NextRequest, { params }: { params: { examId: string } }) {
  try {
    if (!params?.examId) {
      return NextResponse.json({ error: "Missing exam ID in URL" }, { status: 400 });
    }
    
    const { examId } = params;
    const body = await req.json();
    const { task_1_question, task_2_question, task_1_answer, task_2_answer } = body;

    // Extract the Auth token from the request headers
    const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing Authorization Token" }, { status: 401 });
    }    

    // Create a new Supabase client using the token
    const supabase = createSupabaseClient(authHeader);
    const { data: userSession, error: sessionError } = await supabase.auth.getUser();
    if (sessionError || !userSession?.user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    const user_id = userSession.user.id;

    if (!task_1_answer || !task_2_answer || !task_1_question || !task_2_question) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: existingData, error: fetchError } = await supabase
      .from("writing_evaluations")
      .select("id")
      .eq("exam_id", examId)
      .eq("user_id", user_id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const [task1Evaluation, task2Evaluation] = await Promise.all([
      evaluateTask(task_1_answer, 1, task_1_question),
      evaluateTask(task_2_answer, 2, task_2_question)
    ]);

    const overallBand = Math.round(((task1Evaluation.band + (2 * task2Evaluation.band)) / 3) * 2) / 2;

    const newRecord = {
      user_id,
      exam_id: examId,
      task_1_band: task1Evaluation.band,
      task_2_band: task2Evaluation.band,
      overall_band: overallBand,
      task_1_feedback: task1Evaluation.feedback,
      task_2_feedback: task2Evaluation.feedback,
      task_1_rewrite: task1Evaluation.improved_response,
      task_2_rewrite: task2Evaluation.improved_response,
      created_at: new Date().toISOString(),
    };

    if (existingData) {
      const { error: updateError } = await supabase
        .from("writing_evaluations")
        .update(newRecord)
        .eq("exam_id", examId)
        .eq("user_id", user_id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    } else {
      const { error: insertError } = await supabase
        .from("writing_evaluations")
        .insert([{ user_id, ...newRecord }]); // Ensure `user_id` is explicitly included

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to evaluate writing response" }, { status: 500 });
  }    
}

export async function GET(req: NextRequest, { params }: { params: { examId: string } }) {
  try {
    const { examId } = params;
    const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create a new Supabase client using the token
    const supabase = createSupabaseClient(authHeader);
    const { data: userSession, error: sessionError } = await supabase.auth.getUser();
    if (sessionError || !userSession?.user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    const user_id = userSession.user.id;

    const { data, error } = await supabase
      .from("writing_evaluations")
      .select("*")
      .eq("exam_id", examId)
      .eq("user_id", user_id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Evaluation not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch evaluation" }, { status: 500 });
  }
}
