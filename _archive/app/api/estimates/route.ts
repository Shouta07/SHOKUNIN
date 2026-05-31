import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("estimates")
    .select("*, items:estimate_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

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
  const { title, client_name, project_id, valid_until, notes, items } = body;

  if (!title || !client_name || !items || items.length === 0) {
    return NextResponse.json({ error: "件名・提出先・明細は必須です" }, { status: 400 });
  }

  // 見積番号の自動採番
  const { count } = await supabase
    .from("estimates")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const estimateNumber = `EST-${String((count ?? 0) + 1).padStart(4, "0")}`;

  // 金額計算
  let subtotal = 0;
  let costTotal = 0;
  const calculatedItems = items.map((item: {
    job_type: string;
    workers: number;
    days: number;
    unit_price: number;
    cost_price: number;
    notes?: string;
    sort_order?: number;
  }, index: number) => {
    const amount = item.workers * item.days * item.unit_price;
    const costAmount = item.workers * item.days * item.cost_price;
    subtotal += amount;
    costTotal += costAmount;
    return {
      ...item,
      amount,
      cost_amount: costAmount,
      sort_order: item.sort_order ?? index,
      notes: item.notes ?? "",
    };
  });

  const taxRate = 10;
  const taxAmount = Math.floor(subtotal * taxRate / 100);
  const totalAmount = subtotal + taxAmount;
  const grossProfit = subtotal - costTotal;
  const grossMargin = subtotal > 0 ? Math.round((grossProfit / subtotal) * 10000) / 100 : 0;

  // 見積書を作成
  const { data: estimate, error: estimateError } = await supabase
    .from("estimates")
    .insert({
      user_id: user.id,
      project_id: project_id ?? null,
      estimate_number: estimateNumber,
      title,
      client_name,
      valid_until: valid_until ?? null,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      cost_total: costTotal,
      gross_profit: grossProfit,
      gross_margin: grossMargin,
      notes: notes ?? "",
    })
    .select()
    .single();

  if (estimateError) {
    return NextResponse.json({ error: estimateError.message }, { status: 500 });
  }

  // 明細行を作成
  const itemsWithEstimateId = calculatedItems.map((item: {
    job_type: string;
    workers: number;
    days: number;
    unit_price: number;
    cost_price: number;
    amount: number;
    cost_amount: number;
    sort_order: number;
    notes: string;
  }) => ({
    ...item,
    estimate_id: estimate.id,
  }));

  const { error: itemsError } = await supabase
    .from("estimate_items")
    .insert(itemsWithEstimateId);

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  // 過去実績に記録（AI学習用）
  const historyEntries = calculatedItems.map((item: {
    job_type: string;
    unit_price: number;
    cost_price: number;
  }) => ({
    user_id: user.id,
    job_type: item.job_type,
    unit_price: item.unit_price,
    cost_price: item.cost_price,
    client_name,
    accepted: false,
  }));

  await supabase.from("estimate_history").insert(historyEntries);

  // 明細付きで返却
  const { data: fullEstimate } = await supabase
    .from("estimates")
    .select("*, items:estimate_items(*)")
    .eq("id", estimate.id)
    .single();

  return NextResponse.json({ data: fullEstimate }, { status: 201 });
}
