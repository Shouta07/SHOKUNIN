import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();
  const { job_type, client_name, region } = body;

  if (!job_type) {
    return NextResponse.json({ error: "職種は必須です" }, { status: 400 });
  }

  // 過去実績を取得
  const { data: history } = await supabase
    .from("estimate_history")
    .select("*")
    .eq("user_id", user.id)
    .eq("job_type", job_type)
    .order("created_at", { ascending: false })
    .limit(20);

  // 単価マスタを取得
  const { data: masterPrice } = await supabase
    .from("unit_prices")
    .select("*")
    .eq("user_id", user.id)
    .eq("job_type", job_type)
    .eq("is_active", true)
    .single();

  const anthropic = new Anthropic();

  const prompt = `あなたは建設人材派遣業の見積アドバイザーです。以下の情報を元に、適正な人工単価を提案してください。

## 職種
${job_type}

## 提出先
${client_name || "未定"}

## 地域
${region || "不明"}

## 単価マスタ（現在の設定）
${masterPrice ? `出し値: ${masterPrice.base_price.toLocaleString()}円/人工、原価: ${masterPrice.cost_price.toLocaleString()}円/人工` : "未登録"}

## 過去の見積実績（直近20件）
${history && history.length > 0
  ? history.map((h: { client_name: string; unit_price: number; cost_price: number; accepted: boolean; created_at: string }) =>
      `- ${h.client_name}: 出し値${h.unit_price.toLocaleString()}円 / 原価${h.cost_price.toLocaleString()}円 (${h.accepted ? "受注" : "未受注"}) ${h.created_at.slice(0, 10)}`
    ).join("\n")
  : "実績なし"}

## 回答形式
以下のJSON形式で回答してください。説明は日本語で簡潔に。
\`\`\`json
{
  "suggested_price": 数値（出し値単価の提案）,
  "suggested_cost": 数値（原価単価の提案）,
  "margin_rate": 数値（粗利率%）,
  "reasoning": "提案理由の説明（2-3文）",
  "market_insight": "市場動向に関するコメント（1-2文）"
}
\`\`\``;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ error: "AI応答の解析に失敗しました" }, { status: 500 });
  }

  const jsonMatch = content.text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "AI応答の解析に失敗しました" }, { status: 500 });
  }

  const suggestion = JSON.parse(jsonMatch[1].trim());

  return NextResponse.json({ data: suggestion });
}
