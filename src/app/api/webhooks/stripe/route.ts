import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceRoleSupabase } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  const supabase = await createServiceRoleSupabase();

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // コース購入の場合
      if (paymentIntent.metadata.course_id) {
        await supabase.from("course_purchases").insert({
          user_id: paymentIntent.metadata.customer_id,
          course_id: paymentIntent.metadata.course_id,
          stripe_payment_intent_id: paymentIntent.id,
        });
      }

      // 施工注文の決済完了
      if (paymentIntent.metadata.service_package_id) {
        await supabase
          .from("orders")
          .update({ status: "paid" })
          .eq("stripe_payment_intent_id", paymentIntent.id);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("stripe_payment_intent_id", paymentIntent.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
