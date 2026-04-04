"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { UnitPrice } from "@/types/database";

const DEFAULT_JOB_TYPES = [
  "型枠大工", "鳶", "鉄筋工", "電気工", "管工（配管工）",
  "塗装工", "左官工", "クレーンオペ", "土工", "溶接工",
  "内装工", "防水工", "はつり工", "重機オペ", "雑工",
];

export default function MasterPage() {
  const [prices, setPrices] = useState<UnitPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [jobType, setJobType] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchPrices = () => {
    fetch("/api/unit-prices")
      .then(res => res.json())
      .then(json => {
        if (json.data) setPrices(json.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPrices(); }, []);

  const handleAdd = async () => {
    if (!jobType || !basePrice || !costPrice) {
      alert("職種・出し値・原価は必須です");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/unit-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_type: jobType,
          base_price: Number(basePrice),
          cost_price: Number(costPrice),
        }),
      });
      const json = await res.json();
      if (json.error) {
        alert(json.error);
      } else {
        setJobType("");
        setBasePrice("");
        setCostPrice("");
        setShowForm(false);
        fetchPrices();
      }
    } finally {
      setSaving(false);
    }
  };

  const margin = (base: number, cost: number) => {
    if (base === 0) return 0;
    return Math.round((base - cost) / base * 10000) / 100;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>単価マスタ</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "閉じる" : "+ 単価を追加"}
        </Button>
      </div>

      {/* 追加フォーム */}
      {showForm && (
        <Card className="p-4 mb-4">
          <h2 className="font-bold mb-3">新規単価登録</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">職種 *</label>
              <select
                value={jobType}
                onChange={e => setJobType(e.target.value)}
                className="w-full border rounded-lg px-2 py-2 touch-target text-sm"
              >
                <option value="">選択...</option>
                {DEFAULT_JOB_TYPES.filter(jt => !prices.some(p => p.job_type === jt)).map(jt => (
                  <option key={jt} value={jt}>{jt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">出し値単価（円/人工） *</label>
              <input
                type="number"
                value={basePrice}
                onChange={e => setBasePrice(e.target.value)}
                placeholder="25000"
                className="w-full border rounded-lg px-2 py-2 touch-target text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">原価（円/人工） *</label>
              <input
                type="number"
                value={costPrice}
                onChange={e => setCostPrice(e.target.value)}
                placeholder="18000"
                className="w-full border rounded-lg px-2 py-2 touch-target text-sm"
              />
            </div>
          </div>
          {basePrice && costPrice && (
            <p className="text-sm text-gray-600 mb-3">
              粗利率: <span className={`font-bold ${margin(Number(basePrice), Number(costPrice)) >= 20 ? "text-green-600" : "text-yellow-600"}`}>
                {margin(Number(basePrice), Number(costPrice))}%
              </span>
              （粗利: {(Number(basePrice) - Number(costPrice)).toLocaleString()}円/人工）
            </p>
          )}
          <Button onClick={handleAdd} disabled={saving}>
            {saving ? "登録中..." : "登録"}
          </Button>
        </Card>
      )}

      {/* 単価一覧 */}
      {loading ? (
        <p className="text-center text-gray-500 py-8">読み込み中...</p>
      ) : prices.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">単価マスタが未登録です</p>
          <p className="text-sm text-gray-400">見積作成時に使用する職種別の単価を登録してください</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {prices.map(price => (
            <Card key={price.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{price.job_type}</h3>
                  <div className="flex gap-4 text-sm text-gray-600 mt-1">
                    <span>出し値: <strong>{price.base_price.toLocaleString()}円</strong></span>
                    <span>原価: <strong>{price.cost_price.toLocaleString()}円</strong></span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${margin(price.base_price, price.cost_price) >= 20 ? "text-green-600" : "text-yellow-600"}`}>
                    {margin(price.base_price, price.cost_price)}%
                  </p>
                  <p className="text-xs text-gray-500">粗利率</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
