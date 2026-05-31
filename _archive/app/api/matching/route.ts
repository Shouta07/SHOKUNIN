import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * 地図ベースの職人マッチング検索
 * PostGISの地理空間関数を使用して近隣の職人を検索
 */
export async function GET(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { searchParams } = new URL(request.url);

  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");
  const radius = parseInt(searchParams.get("radius") || "50", 10);
  const specialty = searchParams.get("specialty") || undefined;

  if (lat === 0 && lng === 0) {
    return NextResponse.json(
      { error: "位置情報（lat, lng）が必要です" },
      { status: 400 }
    );
  }

  // PostGIS関数で近隣の職人を検索
  const { data, error } = await supabase.rpc("find_nearby_craftsmen", {
    lat,
    lng,
    radius_km: radius,
    specialty_filter: specialty || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/**
 * 郵便番号から緯度経度を取得するヘルパー
 * (zipcloud API を利用)
 */
export async function POST(request: NextRequest) {
  const { postal_code, specialty, radius } = await request.json();

  if (!postal_code) {
    return NextResponse.json(
      { error: "postal_code は必須です" },
      { status: 400 }
    );
  }

  // 郵便番号APIで住所を取得
  const zipRes = await fetch(
    `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postal_code}`
  );
  const zipData = await zipRes.json();

  if (!zipData.results || zipData.results.length === 0) {
    return NextResponse.json(
      { error: "郵便番号が見つかりません" },
      { status: 404 }
    );
  }

  const address = zipData.results[0];

  // 簡易的な住所→座標変換（本番ではGeocoding APIを使用）
  // ここではダミー座標を返す（実装時はGoogle Geocoding等に置換）
  const geocoded = {
    address: `${address.address1}${address.address2}${address.address3}`,
    lat: 35.6762 + Math.random() * 0.1, // ダミー: 東京付近
    lng: 139.6503 + Math.random() * 0.1,
  };

  // 内部的にGET相当の検索を実行
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.rpc("find_nearby_craftsmen", {
    lat: geocoded.lat,
    lng: geocoded.lng,
    radius_km: radius || 50,
    specialty_filter: specialty || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    address: geocoded.address,
    data,
  });
}
