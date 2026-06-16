import { NextRequest, NextResponse } from "next/server";

let submissionCount = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, painLevel, message, contact } = body as {
      category: string;
      painLevel: number;
      message: string;
      contact?: { discord?: string; x?: string; other?: string };
    };

    submissionCount++;

    console.log("[confess]", {
      timestamp: new Date().toISOString(),
      category,
      painLevel,
      message: message ? `${message.substring(0, 50)}...` : "(empty)",
      hasContact: !!(contact?.discord || contact?.x || contact?.other),
      totalCount: submissionCount,
    });

    return NextResponse.json({ success: true, count: submissionCount });
  } catch {
    return NextResponse.json(
      { error: "送信に失敗しました" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ count: submissionCount });
}
