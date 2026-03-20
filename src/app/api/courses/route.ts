import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** コース一覧取得 */
export async function GET() {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      craftsman:craftsman_profiles(display_name, specialty),
      chapters:course_chapters(id, title, duration_seconds, sort_order)
    `
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/** コース新規作成 */
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("craftsman_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json(
      { error: "職人登録が必要です" },
      { status: 403 }
    );
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("courses")
    .insert({
      craftsman_id: profile.id,
      title: body.title,
      description: body.description || "",
      price: body.price,
      schema_json_ld: body.schema_json_ld || {},
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
