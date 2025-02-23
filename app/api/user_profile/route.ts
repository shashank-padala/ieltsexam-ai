// app/api/user_profile/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";

/**
 * GET /api/user_profile
 * - Fetch the current user's profile from user_profiles.
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Validate the Authorization header
    const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing Authorization Token" }, { status: 401 });
    }

    // 2. Create a Supabase client with the user's auth token
    const supabaseClient = createSupabaseClient(authHeader);

    // 3. Get the authenticated user
    const { data: userSession, error: sessionError } = await supabaseClient.auth.getUser();
    if (sessionError || !userSession?.user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }
    const user_id = userSession.user.id;

    // 4. Fetch the user’s profile from user_profiles
    const { data, error } = await supabaseClient
      .from("user_profiles")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      // Return a friendly message if no profile row exists
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 5. Return the profile
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/user_profile
 * - Update the current user's profile with the JSON body sent in the request.
 */
export async function PUT(req: NextRequest) {
  try {
    // 1. Validate the Authorization header
    const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing Authorization Token" }, { status: 401 });
    }

    // 2. Parse the request body
    const body = await req.json();

    // 3. Create a Supabase client with the user's auth token
    const supabaseClient = createSupabaseClient(authHeader);

    // 4. Get the authenticated user
    const { data: userSession, error: sessionError } = await supabaseClient.auth.getUser();
    if (sessionError || !userSession?.user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }
    const user_id = userSession.user.id;

    // 5. Attempt to update user_profiles
    // Make sure to only update the columns that actually exist in your table
    const { data, error } = await supabaseClient
      .from("user_profiles")
      .update({
        full_name: body.full_name,
        phone: body.phone,
        email: body.email,
        country_of_residence: body.country_of_residence,
        city: body.city,
        college: body.college,
        immigration_country: body.immigration_country,
        purpose: body.purpose,
        exam_slot_booked: body.exam_slot_booked,
        exam_slot_date: body.exam_slot_date || null, // handle optional date
        marketing_opt_in: body.marketing_opt_in,
        referral_code: body.referral_code,
        preferred_exam_type: body.preferred_exam_type,
      })
      .eq("user_id", user_id)
      .select() // to return the updated row
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Profile update failed" }, { status: 400 });
    }

    // 6. Return the updated profile
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
