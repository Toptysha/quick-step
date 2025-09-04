"use client";

import { useCloseLoader } from "@/hooks";
import Link from "next/link";

export default function ProductNotFound() {
    useCloseLoader();
  return (
    <main
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 1px 6px rgba(16,24,40,0.08)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 8 }}>🧩</div>
        <h1 style={{ margin: "0 0 4px 0", fontSize: 24, letterSpacing: -0.5 }}>
          Такой товар не найден
        </h1>
        <p style={{ margin: "0 0 16px 0", color: "#6b7280", fontSize: 14 }}>
          Возможно, он был удалён или артикул указан неверно.
        </p>

        <div
          style={{
            display: "grid",
            gap: 8,
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <Link
            href="/catalog"
            style={{
              display: "inline-block",
              padding: "12px 14px",
              borderRadius: 10,
              background: "#0c66ff",
              color: "#fff",
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            Вернуться в каталог
          </Link>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              color: "#111827",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            На главную
          </Link>
        </div>
      </section>
    </main>
  );
}
