import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

/**
 * 職人がラフに入力した「得意なこと」から、
 * 顧客に刺さるサービス説明文 + Schema.org JSON-LD を生成する
 */
export async function POST(request: NextRequest) {
  try {
    const { rawInput, category } = await request.json();

    if (!rawInput || typeof rawInput !== "string") {
      return NextResponse.json(
        { error: "rawInput は必須です" },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `あなたは建築・設備業界のマーケティングのプロです。
以下の職人のラフな入力から、2つの成果物を生成してください。

【入力】
カテゴリ: ${category || "未指定"}
職人の得意なこと: ${rawInput}

【成果物1: サービス説明文】
- 信頼感と専門性を感じさせる文章
- 一般のお客様にもわかりやすい表現
- 300文字程度
- HTML形式（<p>, <ul>, <li> タグを使用）

【成果物2: Schema.org JSON-LD】
- @type: "Service" として構造化
- provider, areaServed, serviceType などを含める
- Google検索やAI回答で引用されやすい形式

以下のJSON形式で返してください:
{
  "title": "サービスタイトル",
  "description": "プレーンテキストの説明",
  "description_html": "<p>HTML形式の説明文</p>",
  "tags": ["タグ1", "タグ2"],
  "schema_json_ld": { Schema.org JSON-LD オブジェクト }
}

JSONのみを返してください。`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("AI応答にテキストが含まれていません");
    }

    // JSONを抽出（コードブロックで囲まれている場合に対応）
    let jsonStr = textBlock.text.trim();
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }

    const generated = JSON.parse(jsonStr);

    return NextResponse.json({ success: true, data: generated });
  } catch (error) {
    console.error("AI生成エラー:", error);
    return NextResponse.json(
      { error: "説明文の生成に失敗しました" },
      { status: 500 }
    );
  }
}
