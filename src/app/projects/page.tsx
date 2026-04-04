"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { Project } from "@/types/database";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "準備中", color: "bg-gray-100 text-gray-700" },
  submitted: { label: "見積提出済", color: "bg-blue-100 text-blue-700" },
  accepted: { label: "受注", color: "bg-green-100 text-green-700" },
  rejected: { label: "失注", color: "bg-red-100 text-red-700" },
  completed: { label: "完了", color: "bg-purple-100 text-purple-700" },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchProjects = () => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(json => {
        if (json.data) setProjects(json.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleAdd = async () => {
    if (!name || !clientName) {
      alert("案件名と元請会社名は必須です");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, client_name: clientName, site_address: siteAddress }),
      });
      const json = await res.json();
      if (json.error) {
        alert(json.error);
      } else {
        setName("");
        setClientName("");
        setSiteAddress("");
        setShowForm(false);
        fetchProjects();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>案件管理</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "閉じる" : "+ 案件を追加"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-4 mb-4">
          <h2 className="font-bold mb-3">新規案件登録</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">案件名 *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="○○ビル新築工事"
                className="w-full border rounded-lg px-3 py-2 touch-target"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">元請会社 *</label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="○○建設株式会社"
                className="w-full border rounded-lg px-3 py-2 touch-target"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1">現場住所</label>
            <input
              type="text"
              value={siteAddress}
              onChange={e => setSiteAddress(e.target.value)}
              placeholder="東京都港区..."
              className="w-full border rounded-lg px-3 py-2 touch-target"
            />
          </div>
          <Button onClick={handleAdd} disabled={saving}>
            {saving ? "登録中..." : "登録"}
          </Button>
        </Card>
      )}

      {loading ? (
        <p className="text-center text-gray-500 py-8">読み込み中...</p>
      ) : projects.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">案件がまだありません</p>
          <p className="text-sm text-gray-400">元請からの案件を登録して管理しましょう</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.map(project => (
            <Card key={project.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.client_name}</p>
                  {project.site_address && (
                    <p className="text-xs text-gray-400 mt-1">{project.site_address}</p>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${STATUS_LABELS[project.status]?.color ?? ""}`}>
                  {STATUS_LABELS[project.status]?.label ?? project.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
