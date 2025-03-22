import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Default evaluation used if OpenAI evaluation fails.
const defaultEvaluation = (answer: string) => ({
  band: 0,
  feedback: {
    task_response: "Evaluation failed due to technical error.",
    coherence_cohesion: "Evaluation failed due to technical error.",
    grammatical_accuracy: "Evaluation failed due to technical error.",
    lexical_resource: "Evaluation failed due to technical error.",
  },
  improved_response: answer,
});

// Modularized function to authenticate and get the user session.
async function getUserSession(req: NextRequest) {
  const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!authHeader) {
    throw new Error("Missing Authorization Token");
  }
  const supabase = createSupabaseClient(authHeader);
  const { data: userSession, error: sessionError } = await supabase.auth.getUser();
  if (sessionError || !userSession?.user) {
    throw new Error("Invalid or expired session");
  }
  return { supabase, user_id: userSession.user.id };
}

// Helper function to get a new attempt number.
async function getNewAttemptNumber(supabase: ReturnType<typeof createSupabaseClient>, examId: string, user_id: string) {
  const { data: lastAttemptData, error: lastAttemptError } = await supabase
    .from("writing_evaluations")
    .select("attempt_number")
    .eq("exam_id", examId)
    .eq("user_id", user_id)
    .order("attempt_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastAttemptError) {
    throw new Error(lastAttemptError.message);
  }
  return lastAttemptData && lastAttemptData.attempt_number ? lastAttemptData.attempt_number + 1 : 1;
}

// Modular function to save the initial evaluation record with default evaluation values.
async function saveInitialEvaluation(supabase: ReturnType<typeof createSupabaseClient>, examId: string, user_id: string, attemptNumber: number, body: any) {
  const { task_1_answer, task_2_answer } = body;
  const insertPayload = {
    user_id,
    exam_id: examId,
    attempt_number: attemptNumber,
    task_1_answer,
    task_2_answer,
    task_1_band: defaultEvaluation(task_1_answer).band,
    task_2_band: defaultEvaluation(task_2_answer).band,
    overall_band: 0,
    task_1_feedback: defaultEvaluation(task_1_answer).feedback,
    task_2_feedback: defaultEvaluation(task_2_answer).feedback,
    task_1_rewrite: defaultEvaluation(task_1_answer).improved_response,
    task_2_rewrite: defaultEvaluation(task_2_answer).improved_response,
  };

  const { error: insertError } = await supabase
    .from("writing_evaluations")
    .insert(insertPayload)
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }
  return insertPayload;
}

// Modular function to update the evaluation record with OpenAI results.
async function updateEvaluationRecord(
  supabase: ReturnType<typeof createSupabaseClient>,
  examId: string,
  user_id: string,
  attemptNumber: number,
  task1Eval: any,
  task2Eval: any
) {
  // Recalculate overall band using the evaluated scores.
  const overallBand = Math.round(((task1Eval.band + (2 * task2Eval.band)) / 3) * 2) / 2;
  const updatedPayload = {
    task_1_band: task1Eval.band,
    task_2_band: task2Eval.band,
    overall_band: overallBand,
    task_1_feedback: task1Eval.feedback,
    task_2_feedback: task2Eval.feedback,
    task_1_rewrite: task1Eval.improved_response,
    task_2_rewrite: task2Eval.improved_response,
  };

  const { error: updateError } = await supabase
    .from("writing_evaluations")
    .update(updatedPayload)
    .eq("exam_id", examId)
    .eq("user_id", user_id)
    .eq("attempt_number", attemptNumber);

  if (updateError) {
    throw new Error(updateError.message);
  }
}

// Modular function to evaluate a task using OpenAI.
async function evaluateTask(taskAnswer: string, taskNumber: number, taskQuestion: string) {
  const prompt = `
    You are an IELTS writing evaluator. Evaluate the following writing task by analyzing the candidate's response for specific mistakes and issues. Instead of giving generic feedback for each criterion, identify concrete errors, weaknesses, or areas of improvement in the response related to:
    - Task Response
    - Coherence and Cohesion
    - Grammatical Range and Accuracy
    - Lexical Resource

    For each criterion, provide detailed, targeted feedback that directly refers to mistakes or shortcomings observed in the candidate's response. Additionally, assign a band score (0-9) based on your analysis and suggest an improved version of the response that corrects these issues. **Ensure your output is strictly valid JSON that can be parsed by JSON.parse in JavaScript. Do not include any markdown formatting, code fences, or additional commentary.** Output only a single JSON object that follows this exact structure:

    {
      "band": <band score as a number>,
      "feedback": {
        "task_response": "<detailed feedback for Task Response, referring to specific mistakes>",
        "coherence_cohesion": "<detailed feedback for Coherence and Cohesion, referring to specific organizational or logical issues>",
        "grammatical_accuracy": "<detailed feedback for Grammatical Range and Accuracy, pointing out specific grammatical errors>",
        "lexical_resource": "<detailed feedback for Lexical Resource, addressing specific vocabulary issues and suggestions>"
      },
      "improved_response": "<Rewrite the user's response to improve it to get a higher band score. If your improved response contains multiple paragraphs, separate them with \\n\\n>"
    }

    IELTS Writing Task ${taskNumber} Question: ${taskQuestion}
    
    Candidate's Response: ${taskAnswer}
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
    const examId = params.examId;
    const body = await req.json();
    const { task_1_question, task_2_question, task_1_answer, task_2_answer } = body;

    // Validate required fields.
    if (!task_1_answer || !task_2_answer || !task_1_question || !task_2_question) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Authenticate user and get Supabase client.
    const { supabase, user_id } = await getUserSession(req);

    // Determine the new attempt number.
    const attemptNumber = await getNewAttemptNumber(supabase, examId, user_id);

    // 1. Save task answers with default evaluation values.
    await saveInitialEvaluation(supabase, examId, user_id, attemptNumber, body);

    // 2. Evaluate tasks using OpenAI. If evaluation fails, default evaluation is used.
    let task1Evaluation, task2Evaluation;
    try {
      task1Evaluation = await evaluateTask(task_1_answer, 1, task_1_question);
    } catch (e) {
      task1Evaluation = defaultEvaluation(task_1_answer);
    }
    try {
      task2Evaluation = await evaluateTask(task_2_answer, 2, task_2_question);
    } catch (e) {
      task2Evaluation = defaultEvaluation(task_2_answer);
    }

    // 3. Update the evaluation record with OpenAI results.
    await updateEvaluationRecord(supabase, examId, user_id, attemptNumber, task1Evaluation, task2Evaluation);

    // 4. Upsert summary record in user_exam_summary.
    const overallBand = Math.round(((task1Evaluation.band + (2 * task2Evaluation.band)) / 3) * 2) / 2;
    const { error: summaryInsertError } = await supabase
      .from("user_exam_summary")
      .upsert([
        {
          user_id,
          exam_id: examId,
          writing_band_score: overallBand,
          last_attempt_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ], { onConflict: "user_id,exam_id" });
      
    if (summaryInsertError) {
      console.error("Error inserting user_exam_summary:", summaryInsertError);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in writing evaluation POST request:", error);
    return NextResponse.json({ error: "Failed to evaluate writing response" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { examId: string } }) {
  try {
    const examId = params.examId;
    const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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
    console.error("Error in fetching evaluation:", error);
    return NextResponse.json({ error: "Failed to fetch evaluation" }, { status: 500 });
  }
}
