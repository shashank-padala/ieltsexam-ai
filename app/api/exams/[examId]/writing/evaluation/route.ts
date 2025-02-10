import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

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

export async function POST(req: NextRequest, context: { params: { examId: string } }) {
  try {
    if (!context?.params?.examId) {
      return NextResponse.json({ error: "Missing exam ID in URL" }, { status: 400 });
    }
    
    const { examId } = context.params;
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

    const [task1Evaluation, task2Evaluation] = await Promise.all([
      evaluateTask(task_1_answer, 1, task_1_question),
      evaluateTask(task_2_answer, 2, task_2_question)
    ]);

    const overallBand = Math.round(((task1Evaluation.band + (2 * task2Evaluation.band)) / 3) * 2) / 2;

    const upsertPayload = {
      user_id,
      exam_id: examId,
      task_1_band: task1Evaluation.band,
      task_2_band: task2Evaluation.band,
      overall_band: overallBand,
      task_1_feedback: task1Evaluation.feedback,
      task_2_feedback: task2Evaluation.feedback,
      task_1_rewrite: task1Evaluation.improved_response,
      task_2_rewrite: task2Evaluation.improved_response,
    };
    
    const { error } = await supabase
      .from("writing_evaluations")
      .upsert(upsertPayload, { 
        onConflict: "exam_id,user_id"
      });
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in writing evaluation POST request:", error);
    return NextResponse.json({ error: "Failed to evaluate writing response" }, { status: 500 });
  }    
}

export async function GET(req: NextRequest, context: { params: { examId: string } }) {
  try {
    const { examId } = context.params;
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
    console.error("Error in fetching evaluation:", error);
    return NextResponse.json({ error: "Failed to fetch evaluation" }, { status: 500 });
  }
}
