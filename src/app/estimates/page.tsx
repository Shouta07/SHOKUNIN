"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { Estimate } from "@/types/database";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "下書き", color: "bg-gray-100 text-gray-700" },
  submitted: { label: "提出済", color: "bg-blue-100 text-blue-700" },
  accepted: { label: "受注", color: "bg-green-100 text-green-700" },
  rejected: { label: "失注", color: "bg-red-100 text-red-700" },
};

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/estimates")
      .then(res => res.json())
      .then(json => {
        if (json.data) setEstimates(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = estimates
    .filter(e => e.status === "accepted")
    .reduce((sum, e) => sum + e.total_amount, 0);

  const avgMargin = estimates.length > 0
    ? Math.round(estimates.reduce((sum, e) => sum + e.gross_margin, 0) / estimates.length * 100) / 100
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>見積一覧</h1>
        <Button onClick={() => window.location.href = "/estimates/new"}>+ 新規作成</Button>
      </div>

      {/* サマリ */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="p-3 text-center">
          <p className="text-xs text-gray-500">見積件数</p>
          <p className="text-xl font-bold">{estimates.length}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-gray-500">受注額合計</p>
          <p className="text-xl font-bold">{totalRevenue.toLocaleString()}円</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-gray-500">平均粗利率</p>
          <p className={`text-xl font-bold ${avgMargin >= 20 ? "text-green-600" : "text-yellow-600"}`}>{avgMargin}%</p>
        </Card>
      </div>

      {/* 見積リスト */}
      {loading ? (
        <p className="text-center text-gray-500 py-8">読み込み中...</p>
      ) : estimates.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">見積書がまだありません</p>
          <Button onClick={() => window.location.href = "/estimates/new"}>最初の見積を作成</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {estimates.map(estimate => (
            <Card key={estimate.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-gray-500">{estimate.estimate_number}</p>
                  <h3 className="font-bold">{estimate.title}</h3>
                  <p className="text-sm text-gray-600">{estimate.client_name}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${STATUS_LABELS[estimate.status]?.color ?? ""}`}>
                  {STATUS_LABELS[estimate.status]?.label ?? estimate.status}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex gap-4 text-sm">
                  <span className="font-bold">{estimate.total_amount.toLocaleString()}円</span>
                  <span className={estimate.gross_margin >= 20 ? "text-green-600" : "text-yellow-600"}>
                    粗利 {estimate.gross_margin}%
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(estimate.created_at).toLocaleDateString("ja-JP")}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
