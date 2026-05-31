"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function DashboardPage() {
  const [rawInput, setRawInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<{
    title: string;
    description: string;
    description_html: string;
    tags: string[];
  } | null>(null);

  const handleGenerate = async () => {
    if (!rawInput.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput, category: "" }),
      });
      const data = await res.json();
      if (data.success) {
        setGenerated(data.data);
      }
    } catch {
      // エラーハンドリング
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="px-4 pb-24 pt-6">
      <h1 className="mb-6 text-2xl font-black">職人ダッシュボード</h1>

      {/* かんたん出品 */}
      <Card className="mb-6">
        <h2 className="mb-3 text-lg font-bold">かんたん出品</h2>
        <p className="mb-3 text-sm text-gray-500">
          得意なことをラフに入力するだけ。AIが魅力的なサービス説明を生成します。
        </p>

        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="例：エアコンの設置が得意。20年の経験あり。家庭用から業務用まで対応可。即日対応もできる。"
          className="touch-target mb-3 w-full rounded-xl border-2 border-gray-200 px-4 py-4 text-base focus:border-[var(--color-primary)] focus:outline-none"
          rows={4}
        />

        <Button
          onClick={handleGenerate}
          className="w-full"
          disabled={generating || !rawInput.trim()}
        >
          {generating ? "AI生成中..." : "AIで説明文を自動生成"}
        </Button>
      </Card>

      {/* AI生成結果プレビュー */}
      {generated && (
        <Card className="mb-6 border-2 border-[var(--color-accent)]">
          <h3 className="mb-2 text-lg font-bold text-[var(--color-accent)]">
            生成結果
          </h3>
          <h4 className="mb-2 text-xl font-black">{generated.title}</h4>
          <div
            className="prose prose-sm mb-3"
            dangerouslySetInnerHTML={{ __html: generated.description_html }}
          />
          <div className="flex flex-wrap gap-1">
            {generated.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <Button className="mt-4 w-full" variant="primary">
            この内容で出品する
          </Button>
        </Card>
      )}

      {/* 注文管理 */}
      <Card className="mb-4">
        <h2 className="mb-3 text-lg font-bold">受注一覧</h2>
        <p className="text-sm text-gray-400">
          ログイン後、受注した案件がここに表示されます
        </p>
      </Card>

      {/* 売上サマリー */}
      <Card>
        <h2 className="mb-3 text-lg font-bold">売上</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-black text-[var(--color-primary)]">
              ¥0
            </p>
            <p className="text-xs text-gray-400">今月の売上</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black">0件</p>
            <p className="text-xs text-gray-400">完了した施工</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
