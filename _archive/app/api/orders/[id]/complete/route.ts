import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

/**
 * 施工完了処理:
 * 1. 写真アップロード
 * 2. Stripe決済キャプチャ
 * 3. PDF請求書生成（雛形）
 * 4. n8n通知
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params;
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  // 注文を取得して権限チェック
  const { data: order } = await supabase
    .from("orders")
    .select("*, craftsman:craftsman_profiles(user_id, display_name)")
    .eq("id", orderId)
    .single();

  if (!order) {
    return NextResponse.json(
      { error: "注文が見つかりません" },
      { status: 404 }
    );
  }

  if (order.craftsman.user_id !== user.id) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  // 完了写真のアップロード処理
  const formData = await request.formData();
  const photo = formData.get("photo") as File | null;

  let photoUrl: string | null = null;

  if (photo) {
    const fileName = `orders/${orderId}/completion_${Date.now()}.${photo.name.split(".").pop()}`;
    const { error: uploadError } = await supabase.storage
      .from("completion-photos")
      .upload(fileName, photo);

    if (!uploadError) {
      const { data: publicUrl } = supabase.storage
        .from("completion-photos")
        .getPublicUrl(fileName);
      photoUrl = publicUrl.publicUrl;
    }
  }

  // Stripe決済をキャプチャ（仮押さえ → 確定）
  if (order.stripe_payment_intent_id) {
    await getStripe().paymentIntents.capture(order.stripe_payment_intent_id);
  }

  // PDF請求書の雛形生成（実際はn8nで生成してURLを保存）
  const invoiceData = {
    order_id: orderId,
    craftsman_name: order.craftsman.display_name,
    total_price: order.total_price,
    completed_at: new Date().toISOString(),
    photo_url: photoUrl,
  };

  // 注文ステータス更新
  const { data: updatedOrder, error } = await supabase
    .from("orders")
    .update({
      status: "completed",
      completion_photo_url: photoUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // n8n Webhookに完了通知（PDF生成・メール送信トリガー）
  if (process.env.N8N_WEBHOOK_URL) {
    fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "order_completed",
        order: updatedOrder,
        invoice_data: invoiceData,
      }),
    }).catch(console.error);
  }

  return NextResponse.json({ data: updatedOrder });
}
