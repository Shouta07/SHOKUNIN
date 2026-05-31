import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** 施工パッケージ一覧取得 */
export async function GET(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let query = supabase
    .from("service_packages")
    .select(
      `
      *,
      craftsman:craftsman_profiles(display_name, specialty, rating, review_count)
    `
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/** 施工パッケージ新規作成 */
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  // 職人プロフィールを取得
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
    .from("service_packages")
    .insert({
      craftsman_id: profile.id,
      title: body.title,
      description: body.description,
      description_html: body.description_html || "",
      price: body.price,
      duration_minutes: body.duration_minutes || 60,
      category: body.category || "",
      tags: body.tags || [],
      schema_json_ld: body.schema_json_ld || {},
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
