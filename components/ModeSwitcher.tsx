"use client";
import { motion } from "framer-motion";

type Mode = "publico" | "vendedor" | "admin";
interface Props { current: Mode; onChange: (m: Mode) => void; }

const ICONS: Record<Mode, React.ReactNode> = {
  publico: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
  ),
  vendedor: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="3" width="12" height="18" rx="2" /><path d="M10 6h4" /><circle cx="12" cy="17" r="1" /></svg>
  ),
  admin: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2.3-1.3L13.9 2h-3.8l-.4 2.2a7 7 0 0 0-2.3 1.3l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2.6l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2.3 1.3l.4 2.2h3.8l.4-2.2a7 7 0 0 0 2.3-1.3l2.3 1 2-3.4-2-1.5A7 7 0 0 0 19 12z" /></svg>
  ),
};
const LABEL: Record<Mode, string> = { publico: "Público", vendedor: "Vendedor", admin: "Admin" };

export default function ModeSwitcher({ current, onChange }: Props) {
  return (
    <div className="mode-switcher">
      <div style={{ background: "var(--surface)", backdropFilter: "blur(10px)", borderRadius: 16, padding: "8px 10px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 6, boxShadow: "0 6px 24px var(--shadow)" }}>
        <p style={{ fontSize: 9, color: "var(--muted)", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>MODO</p>
        {(["publico", "vendedor", "admin"] as Mode[]).map((m) => (
          <motion.button key={m} whileTap={{ scale: 0.95 }} onClick={() => onChange(m)}
            className={`mode-btn mode-btn-${m} ${current === m ? "active" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-start" }}>
            {ICONS[m]} {LABEL[m]}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
