import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * 動画の署名付きURL取得
 * 購入済みユーザーのみアクセス可能
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseId } = await params;
  const supabase = await createServerSupabase();
  const { searchParams } = new URL(request.url);
  const chapterId = searchParams.get("chapter_id");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  // 購入済みか確認
  const { data: purchase } = await supabase
    .from("course_purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  // コースの所有者（職人本人）かも確認
  const { data: course } = await supabase
    .from("courses")
    .select("craftsman_id, craftsman_profiles(user_id)")
    .eq("id", courseId)
    .single();

  const craftsmanData = course?.craftsman_profiles as unknown as { user_id: string } | null;
  const isOwner = craftsmanData?.user_id === user.id;

  if (!purchase && !isOwner) {
    return NextResponse.json(
      { error: "このコースを購入してください" },
      { status: 403 }
    );
  }

  if (!chapterId) {
    return NextResponse.json(
      { error: "chapter_id は必須です" },
      { status: 400 }
    );
  }

  // チャプター情報を取得
  const { data: chapter } = await supabase
    .from("course_chapters")
    .select("video_path")
    .eq("id", chapterId)
    .eq("course_id", courseId)
    .single();

  if (!chapter) {
    return NextResponse.json(
      { error: "チャプターが見つかりません" },
      { status: 404 }
    );
  }

  // 署名付きURL生成（60分有効）
  const { data: signedUrl, error } = await supabase.storage
    .from("course-videos")
    .createSignedUrl(chapter.video_path, 3600);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ url: signedUrl.signedUrl });
}
