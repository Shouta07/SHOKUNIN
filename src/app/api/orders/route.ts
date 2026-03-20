import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

/** 注文一覧取得 */
export async function GET() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      service_package:service_packages(title, price),
      craftsman:craftsman_profiles(display_name)
    `
    )
    .or(`customer_id.eq.${user.id},craftsman_id.in.(select id from craftsman_profiles where user_id='${user.id}')`)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/** 新規注文作成（Stripeオーソリ付き） */
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { service_package_id, notes, scheduled_date } = await request.json();

  // パッケージ情報を取得
  const { data: pkg } = await supabase
    .from("service_packages")
    .select("*, craftsman:craftsman_profiles(id, display_name)")
    .eq("id", service_package_id)
    .single();

  if (!pkg) {
    return NextResponse.json(
      { error: "パッケージが見つかりません" },
      { status: 404 }
    );
  }

  // Stripeで仮押さえ（オーソリ）
  const paymentIntent = await getStripe().paymentIntents.create({
    amount: pkg.price,
    currency: "jpy",
    capture_method: "manual", // 仮押さえ: 施工完了時にキャプチャ
    metadata: {
      service_package_id,
      customer_id: user.id,
    },
  });

  // 注文レコード作成
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_id: user.id,
      craftsman_id: pkg.craftsman.id,
      service_package_id,
      status: "authorized",
      stripe_payment_intent_id: paymentIntent.id,
      scheduled_date,
      total_price: pkg.price,
      notes: notes || "",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // n8n Webhookに通知（カレンダー登録など）
  if (process.env.N8N_WEBHOOK_URL) {
    fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "order_created",
        order,
        craftsman_name: pkg.craftsman.display_name,
        service_title: pkg.title,
        scheduled_date,
      }),
    }).catch(console.error); // Fire and forget
  }

  return NextResponse.json(
    {
      data: order,
      client_secret: paymentIntent.client_secret,
    },
    { status: 201 }
  );
}
