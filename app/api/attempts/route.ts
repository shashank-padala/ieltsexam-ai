import { supabase } from '../../utils/supabaseClient';

export async function POST(req: Request) {
    const { user_id, exam_id, question_id } = await req.json();

    const { data, error } = await supabase
        .from('attempts')
        .insert([{ user_id, exam_id, question_id }])
        .select();

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify(data), { status: 201 });
}
