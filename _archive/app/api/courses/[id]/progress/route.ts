import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** 学習進捗の取得 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseId } = await params;
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("learning_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", courseId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 完了率を計算
  const { count: totalChapters } = await supabase
    .from("course_chapters")
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseId);

  const completedChapters = data?.filter((p) => p.is_completed).length ?? 0;
  const completionRate =
    totalChapters && totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0;

  return NextResponse.json({
    progress: data,
    completion_rate: completionRate,
    completed_chapters: completedChapters,
    total_chapters: totalChapters,
  });
}

/** 学習進捗の更新 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseId } = await params;
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { chapter_id, watched_seconds, is_completed } = await request.json();

  const { data, error } = await supabase
    .from("learning_progress")
    .upsert(
      {
        user_id: user.id,
        chapter_id,
        course_id: courseId,
        watched_seconds,
        is_completed: is_completed || false,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,chapter_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
