import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("unit_prices")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("job_type");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();
  const { job_type, base_price, cost_price, night_multiplier, overtime_multiplier, notes } = body;

  if (!job_type || base_price == null || cost_price == null) {
    return NextResponse.json({ error: "職種名・出し値単価・原価は必須です" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("unit_prices")
    .insert({
      user_id: user.id,
      job_type,
      base_price,
      cost_price,
      night_multiplier: night_multiplier ?? 1.25,
      overtime_multiplier: overtime_multiplier ?? 1.25,
      notes: notes ?? "",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
