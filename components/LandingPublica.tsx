"use client";
import { motion } from "framer-motion";


interface Props { onEnterDemo: () => void; }

const features = [
  { icon: "📍", title: "Rutas en Tiempo Real", desc: "Geolocalización en vivo de cada vendedor. Sabe exactamente dónde está cada unidad." },
  { icon: "📦", title: "Pedidos en Campo", desc: "Levanta pedidos desde el celular. Preventa y venta a bordo, sin papel." },
  { icon: "💵", title: "Cobros y Saldos", desc: "Registra pagos, saldos pendientes e historial por cliente al instante." },
  { icon: "📊", title: "Reportes Diarios", desc: "Cuánto vendió cada ruta, quién cobró, qué quedó pendiente." },
  { icon: "🏪", title: "Catálogo Digital", desc: "Muestra productos con precio en el celular. Sin errores de precio." },
  { icon: "✍️", title: "Firma de Entrega", desc: "Captura firma del cliente como evidencia de cada entrega." },
];

const stats = [
  { value: "4", label: "Vendedores activos" },
  { value: "8", label: "Clientes en ruta" },
  { value: "$9,340", label: "Ventas hoy" },
  { value: "100%", label: "Entregas confirmadas" },
];

export default function LandingPublica({ onEnterDemo }: Props) {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", paddingBottom: 120 }}>
      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{
          background: "linear-gradient(180deg, rgba(204,31,31,0.12) 0%, transparent 100%)",
          minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "60px 24px 40px", textAlign: "center"
        }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>🚚</div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div style={{
              fontSize: 36, fontWeight: 900, letterSpacing: "0.08em",
              background: "linear-gradient(135deg, #CC1F1F, #FF6666)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>ROPESA</div>
            <p style={{ color: "#888", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>COMERCIALIZADORA</p>
          </motion.div>

          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
            style={{ color: "#ccc", fontSize: 16, maxWidth: 300, lineHeight: 1.6, marginBottom: 32 }}>
            Tu operación comercial centralizada y disponible en tiempo real
          </motion.p>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 280 }}>
            <button className="btn-primary" style={{ justifyContent: "center", fontSize: 15 }} onClick={onEnterDemo}>
              <span>📱</span> Ver Demo de Vendedor
            </button>
            <p style={{ color: "#555", fontSize: 11, textAlign: "center" }}>Sin login — acceso inmediato</p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "0 16px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {stats.map((s, i) => (
            <motion.div key={i} className="card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * i + 0.6 }}
              style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#CC1F1F" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "0 16px 24px" }}>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
          ¿Qué puede hacer tu equipo?
        </motion.h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {features.map((f, i) => (
            <motion.div key={i} className="card" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 * i + 0.9 }}
              style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div style={{ padding: "0 16px" }}>
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          style={{ textAlign: "center", background: "linear-gradient(135deg, rgba(204,31,31,0.1), transparent)", borderColor: "rgba(204,31,31,0.3)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Deja atrás el papel</h3>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 20, lineHeight: 1.6 }}>
            Toda tu operación centralizada. Tus vendedores más eficientes. Tu negocio más rentable.
          </p>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={onEnterDemo}>
            Explorar la App 🚀
          </button>
        </motion.div>
      </div>
    </div>
  );
}
