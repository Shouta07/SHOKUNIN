"use client";

import { useState, useCallback } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface EstimateItemRow {
  job_type: string;
  workers: number;
  days: number;
  unit_price: number;
  cost_price: number;
  notes: string;
}

const DEFAULT_JOB_TYPES = [
  "型枠大工", "鳶", "鉄筋工", "電気工", "管工（配管工）",
  "塗装工", "左官工", "クレーンオペ", "土工", "溶接工",
  "内装工", "防水工", "はつり工", "重機オペ", "雑工",
];

function emptyItem(): EstimateItemRow {
  return { job_type: "", workers: 1, days: 1, unit_price: 0, cost_price: 0, notes: "" };
}

export default function NewEstimatePage() {
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<EstimateItemRow[]>([emptyItem()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ estimate_number: string; total_amount: number; gross_margin: number } | null>(null);
  const [aiLoading, setAiLoading] = useState<number | null>(null);

  const updateItem = useCallback((index: number, field: keyof EstimateItemRow, value: string | number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }, []);

  const addItem = () => setItems(prev => [...prev, emptyItem()]);

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // 行ごとの金額計算
  const calcAmount = (item: EstimateItemRow) => item.workers * item.days * item.unit_price;
  const calcCost = (item: EstimateItemRow) => item.workers * item.days * item.cost_price;

  const subtotal = items.reduce((sum, item) => sum + calcAmount(item), 0);
  const costTotal = items.reduce((sum, item) => sum + calcCost(item), 0);
  const taxAmount = Math.floor(subtotal * 0.1);
  const totalAmount = subtotal + taxAmount;
  const grossProfit = subtotal - costTotal;
  const grossMargin = subtotal > 0 ? Math.round((grossProfit / subtotal) * 10000) / 100 : 0;

  // AI単価提案
  const suggestPrice = async (index: number) => {
    const item = items[index];
    if (!item.job_type) return;
    setAiLoading(index);
    try {
      const res = await fetch("/api/ai/suggest-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_type: item.job_type, client_name: clientName }),
      });
      const json = await res.json();
      if (json.data) {
        updateItem(index, "unit_price", json.data.suggested_price);
        updateItem(index, "cost_price", json.data.suggested_cost);
      }
    } catch {
      // エラー時は何もしない
    } finally {
      setAiLoading(null);
    }
  };

  // 見積書の保存
  const handleSubmit = async () => {
    if (!title || !clientName || items.some(i => !i.job_type || !i.unit_price)) {
      alert("件名・提出先・全明細の職種と単価を入力してください");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/estimates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, client_name: clientName, notes, items }),
      });
      const json = await res.json();
      if (json.error) {
        alert(json.error);
      } else {
        setResult({
          estimate_number: json.data.estimate_number,
          total_amount: json.data.total_amount,
          gross_margin: json.data.gross_margin,
        });
      }
    } catch {
      alert("保存に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-4 pt-8">
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">OK</div>
          <h2 className="text-xl font-bold mb-2">見積書を作成しました</h2>
          <p className="text-gray-600 mb-6">見積番号: {result.estimate_number}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">合計金額（税込）</p>
              <p className="text-2xl font-bold">{result.total_amount.toLocaleString()}円</p>
            </div>
            <div className={`rounded-lg p-4 ${result.gross_margin >= 20 ? "bg-green-50" : "bg-yellow-50"}`}>
              <p className="text-sm text-gray-500">粗利率</p>
              <p className="text-2xl font-bold">{result.gross_margin}%</p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.location.href = "/estimates"}>見積一覧へ</Button>
            <Button variant="secondary" onClick={() => { setResult(null); setItems([emptyItem()]); setTitle(""); setClientName(""); setNotes(""); }}>
              新規作成
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--color-primary)" }}>
        見積書 作成
      </h1>

      {/* 基本情報 */}
      <Card className="p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">件名 *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="○○ビル新築工事 人工応援"
              className="w-full border rounded-lg px-3 py-2 touch-target"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">提出先（元請） *</label>
            <input
              type="text"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              placeholder="○○建設株式会社"
              className="w-full border rounded-lg px-3 py-2 touch-target"
            />
          </div>
        </div>
      </Card>

      {/* 明細行 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">明細</h2>
          <Button variant="secondary" onClick={addItem}>+ 行を追加</Button>
        </div>

        {items.map((item, index) => (
          <Card key={index} className="p-4 mb-3">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => suggestPrice(index)}
                  disabled={aiLoading === index || !item.job_type}
                  className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                >
                  {aiLoading === index ? "AI分析中..." : "AI単価提案"}
                </button>
                {items.length > 1 && (
                  <button onClick={() => removeItem(index)} className="text-xs text-red-500 hover:text-red-700">
                    削除
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs text-gray-500 mb-1">職種 *</label>
                <select
                  value={item.job_type}
                  onChange={e => updateItem(index, "job_type", e.target.value)}
                  className="w-full border rounded-lg px-2 py-2 touch-target text-sm"
                >
                  <option value="">選択...</option>
                  {DEFAULT_JOB_TYPES.map(jt => (
                    <option key={jt} value={jt}>{jt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">人数</label>
                <input
                  type="number"
                  min={1}
                  value={item.workers}
                  onChange={e => updateItem(index, "workers", Number(e.target.value))}
                  className="w-full border rounded-lg px-2 py-2 touch-target text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">日数</label>
                <input
                  type="number"
                  min={0.5}
                  step={0.5}
                  value={item.days}
                  onChange={e => updateItem(index, "days", Number(e.target.value))}
                  className="w-full border rounded-lg px-2 py-2 touch-target text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">出し値単価（円/人工）</label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={item.unit_price}
                  onChange={e => updateItem(index, "unit_price", Number(e.target.value))}
                  className="w-full border rounded-lg px-2 py-2 touch-target text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">原価（円/人工）</label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={item.cost_price}
                  onChange={e => updateItem(index, "cost_price", Number(e.target.value))}
                  className="w-full border rounded-lg px-2 py-2 touch-target text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">小計</label>
                <p className="text-sm font-bold py-2">{calcAmount(item).toLocaleString()}円</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">粗利</label>
                <p className={`text-sm font-bold py-2 ${calcAmount(item) - calcCost(item) > 0 ? "text-green-600" : "text-red-600"}`}>
                  {(calcAmount(item) - calcCost(item)).toLocaleString()}円
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 合計 */}
      <Card className="p-4 mb-4">
        <h2 className="text-lg font-bold mb-3">合計</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500">小計</p>
            <p className="text-lg font-bold">{subtotal.toLocaleString()}円</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">消費税（10%）</p>
            <p className="text-lg font-bold">{taxAmount.toLocaleString()}円</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">合計（税込）</p>
            <p className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>
              {totalAmount.toLocaleString()}円
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">粗利 / 粗利率</p>
            <p className={`text-lg font-bold ${grossMargin >= 20 ? "text-green-600" : grossMargin >= 10 ? "text-yellow-600" : "text-red-600"}`}>
              {grossProfit.toLocaleString()}円 ({grossMargin}%)
            </p>
          </div>
        </div>
      </Card>

      {/* 備考 */}
      <Card className="p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="交通費別途、雨天中止の場合は振替日を協議"
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </Card>

      {/* 保存ボタン */}
      <div className="flex gap-3">
        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "保存中..." : "見積書を保存"}
        </Button>
      </div>
    </div>
  );
}
