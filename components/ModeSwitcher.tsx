"use client";
import { motion } from "framer-motion";

type Mode = "publico" | "vendedor" | "admin";
interface Props { current: Mode; onChange: (m: Mode) => void; }

export default function ModeSwitcher({ current, onChange }: Props) {
  return (
    <div className="mode-switcher">
      <div style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)", borderRadius: 16, padding: "8px 10px", border: "1px solid #282828", display: "flex", flexDirection: "column", gap: 6 }}>
        <p style={{ fontSize: 9, color: "#555", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>MODO</p>
        {(["publico", "vendedor", "admin"] as Mode[]).map((m) => (
          <motion.button
            key={m}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(m)}
            className={`mode-btn mode-btn-${m} ${current === m ? "active" : ""}`}
          >
            {m === "publico" ? "🌐 Público" : m === "vendedor" ? "📱 Vendedor" : "⚙️ Admin"}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
