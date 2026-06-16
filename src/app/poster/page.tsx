"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

export default function PosterPage() {
  const [url, setUrl] = useState("https://shokunin-coral.vercel.app/confess");

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            margin: 0 !important;
            background: #000 !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        className="relative bg-black text-white"
        style={{
          width: "210mm",
          height: "297mm",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif",
        }}
      >
        <p
          style={{
            fontSize: "36px",
            fontWeight: 300,
            letterSpacing: "0.1em",
            marginBottom: "8px",
          }}
        >
          誰にも言えないことを
        </p>
        <p
          style={{
            fontSize: "48px",
            fontWeight: 500,
            letterSpacing: "0.15em",
            marginBottom: "80px",
          }}
        >
          ここへ
        </p>

        <div
          style={{
            padding: "16px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            marginBottom: "24px",
          }}
        >
          <QRCodeSVG
            value={url}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
            level="M"
          />
        </div>
      </div>

      <div className="no-print flex flex-col items-center gap-4 py-8 bg-gray-950">
        <div className="w-full max-w-md px-4">
          <label className="block text-gray-400 text-sm mb-2">QRコードのリンク先URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-500"
          />
        </div>
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-white px-8 py-3 text-black font-medium hover:bg-gray-200 transition-colors"
        >
          A4で印刷する
        </button>
      </div>
    </>
  );
}
