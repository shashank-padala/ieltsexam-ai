import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    const type = searchParams.get('type');

    if (!year || !type) {
        return NextResponse.json({ error: "Year and type are required" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('year', year)
        .eq('type', type);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ exams: data }, { status: 200 });
}
