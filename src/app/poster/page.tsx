"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

export default function PosterPage() {
  const [url, setUrl] = useState("https://shokunin-coral.vercel.app/confess");

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400&display=swap');
        @media print {
          body { margin: 0 !important; background: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: A4; margin: 0; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div
        style={{
          width: "210mm",
          height: "297mm",
          margin: "0 auto",
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', 'Hiragino Sans', 'Noto Sans JP', sans-serif",
          color: "#fff",
          position: "relative",
        }}
      >
        <p style={{
          fontSize: "40px",
          fontWeight: 200,
          letterSpacing: "0.08em",
          marginBottom: "4px",
          lineHeight: 1.6,
        }}>
          誰にも言えないことを
        </p>
        <p style={{
          fontSize: "52px",
          fontWeight: 300,
          letterSpacing: "0.12em",
          marginBottom: "72px",
        }}>
          ここへ
        </p>

        <div style={{
          padding: "16px",
          background: "#fff",
          borderRadius: "16px",
          marginBottom: "20px",
        }}>
          <QRCodeSVG
            value={url}
            size={180}
            bgColor="#ffffff"
            fgColor="#000000"
            level="M"
          />
        </div>

        <p style={{
          fontSize: "10px",
          fontWeight: 300,
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.08em",
        }}>
          anonymous — no sign up
        </p>
      </div>

      <div className="no-print" style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
        padding: "32px", background: "#0a0a0a",
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <label style={{ display: "block", color: "#666", fontSize: "12px", marginBottom: "8px", letterSpacing: "0.1em" }}>
            QR LINK URL
          </label>
          <input
            type="text" value={url} onChange={(e) => setUrl(e.target.value)}
            style={{
              width: "100%", background: "#111", border: "1px solid #222",
              borderRadius: "10px", padding: "14px 16px", color: "#fff",
              fontSize: "14px", outline: "none",
            }}
          />
        </div>
        <button onClick={() => window.print()}
          style={{
            background: "#fff", color: "#000", border: "none",
            borderRadius: "100px", padding: "14px 48px",
            fontSize: "14px", fontWeight: 500, letterSpacing: "0.05em",
            cursor: "pointer",
          }}>
          Print A4
        </button>
      </div>
    </>
  );
}
