// app/api/user_exam_summary/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  // Parse query parameters from the request URL
  const { searchParams } = new URL(req.url);
  const examId = searchParams.get("examId");

  // Get and validate the Authorization header
  const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!authHeader) {
    return NextResponse.json({ error: "Missing Authorization Token" }, { status: 401 });
  }
  const supabaseClient = createSupabaseClient(authHeader);

  // Get the authenticated user
  const { data: userSession, error: sessionError } = await supabaseClient.auth.getUser();
  if (sessionError || !userSession?.user) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }
  const user_id = userSession.user.id;

  // Build query for user_exam_summary records for this user
  let query = supabaseClient
    .from("user_exam_summary")
    .select("*")
    .eq("user_id", user_id);
  
  if (examId) {
    query = query.eq("exam_id", examId);
  }

  // Execute the query
  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return NextResponse.json({ error: "No summary records found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
