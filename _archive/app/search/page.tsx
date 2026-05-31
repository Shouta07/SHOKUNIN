"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface Craftsman {
  id: string;
  display_name: string;
  specialty: string;
  rating: number;
  review_count: number;
  distance_km: number;
}

export default function SearchPage() {
  const [postalCode, setPostalCode] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [results, setResults] = useState<Craftsman[]>([]);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postal_code: postalCode.replace("-", ""),
          specialty: specialty || undefined,
          radius: 50,
        }),
      });
      const data = await res.json();
      setResults(data.data || []);
      setAddress(data.address || "");
    } catch {
      // エラー時は空で表示
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
    "エアコン",
    "電気工事",
    "水道",
    "内装",
    "外壁",
    "リフォーム",
  ];

  return (
    <div className="px-4 pb-24 pt-6">
      <h1 className="mb-6 text-2xl font-black">近くの職人を探す</h1>

      {/* 郵便番号入力（大きなフォーム・軍手対応） */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          郵便番号
        </label>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="1234567"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="touch-target w-full rounded-xl border-2 border-gray-200 px-4 py-4 text-xl font-bold tracking-widest focus:border-[var(--color-primary)] focus:outline-none"
          maxLength={8}
        />
      </div>

      {/* 専門分野フィルター */}
      <div className="mb-6 flex flex-wrap gap-2">
        {specialties.map((s) => (
          <button
            key={s}
            onClick={() => setSpecialty(specialty === s ? "" : s)}
            className={`touch-target rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              specialty === s
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white text-gray-700 shadow-sm"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <Button onClick={handleSearch} className="mb-6 w-full" disabled={loading}>
        {loading ? "検索中..." : "この地域の職人を探す"}
      </Button>

      {/* 検索結果 */}
      {address && (
        <p className="mb-4 text-sm text-gray-500">
          {address} 周辺の検索結果
        </p>
      )}

      <div className="space-y-3">
        {results.map((craftsman) => (
          <Card key={craftsman.id} className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              🔧
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{craftsman.display_name}</h3>
              <p className="text-sm text-gray-500">{craftsman.specialty}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                <span>★ {craftsman.rating}</span>
                <span>({craftsman.review_count}件)</span>
                <span>約{craftsman.distance_km}km</span>
              </div>
            </div>
            <Button variant="primary" size="md">
              依頼
            </Button>
          </Card>
        ))}

        {results.length === 0 && address && (
          <p className="text-center text-gray-400 py-8">
            この地域に対応可能な職人が見つかりませんでした
          </p>
        )}
      </div>
    </div>
  );
}
