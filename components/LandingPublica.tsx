"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onEnterDemo: () => void; }

const Icon = ({ d, fill }: { d: string; fill?: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{<path d={d} />}</svg>
);

const features = [
  { d: "M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z M12 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z", title: "Rutas en Tiempo Real", desc: "Geolocalización en vivo de cada vendedor. Sabe dónde está cada unidad." },
  { d: "M3 7h13v10H3z M16 10h3l2 3v4h-5z M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z", title: "Pedidos en Campo", desc: "Levanta pedidos desde el celular. Preventa y venta a bordo, sin papel." },
  { d: "M3 6h18v12H3z M3 10h18 M7 14h4", title: "Cobros y Saldos", desc: "Registra pagos, saldos pendientes e historial por cliente al instante." },
  { d: "M4 19V5 M9 19v-7 M14 19V9 M19 19v-4", title: "Reportes Diarios", desc: "Cuánto vendió cada ruta, quién cobró, qué quedó pendiente." },
  { d: "M4 4h16v4H4z M6 8v12h12V8 M9 12h6", title: "Catálogo Digital", desc: "Muestra productos con precio en el celular. Sin errores de precio." },
  { d: "M4 18l6-6 3 3 7-7 M14 8h5v5", title: "Crecimiento Medible", desc: "Cada visita, cada cobro y cada venta queda registrado y medible." },
];

const stats = [
  { value: "4", label: "Vendedores activos" },
  { value: "8", label: "Clientes en ruta" },
  { value: "$9,340", label: "Ventas hoy" },
  { value: "100%", label: "Entregas confirmadas" },
];

export default function LandingPublica({ onEnterDemo }: Props) {
  const [sent, setSent] = useState(false);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 120 }}>
      {/* Hero con imagen */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src="/images/hero.jpg" alt="ROPESA vendedores en ruta" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.55) 55%, var(--bg) 100%)" }} />
        </div>
        <div style={{ position: "relative", minHeight: 340, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "70px 24px 40px", textAlign: "center" }}>
          <motion.img src="/images/logo.jpg" alt="ROPESA" width={92} height={92} style={{ borderRadius: "50%", border: "2px solid rgba(255,255,255,0.25)", boxShadow: "0 10px 36px rgba(0,0,0,0.5)" }}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }} />
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: "0.08em", marginTop: 8, background: "linear-gradient(135deg, #FF6666, #CC1F1F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>ROPESA</div>
            <p style={{ color: "#E5E5E5", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 10 }}>COMERCIALIZADORA</p>
          </motion.div>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
            style={{ color: "#F0F0F0", fontSize: 16, maxWidth: 320, lineHeight: 1.6, marginBottom: 28, textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
            Tu operación comercial centralizada y disponible en tiempo real
          </motion.p>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 300 }}>
            <button className="btn-primary" style={{ justifyContent: "center", fontSize: 15, padding: 14 }} onClick={onEnterDemo}>
              Explorar demo sin registrarme
            </button>
            <p style={{ color: "#DADADA", fontSize: 11, textAlign: "center" }}>Acceso inmediato — no necesitas cuenta</p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "8px 16px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {stats.map((s, i) => (
            <motion.div key={i} className="card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 * i + 0.5 }} style={{ textAlign: "center", padding: 16 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--ropesa-red)" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "0 16px 24px" }}>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>
          ¿Qué puede hacer tu equipo?
        </motion.h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {features.map((f, i) => (
            <motion.div key={i} className="card" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.08 * i + 0.8 }} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: 16 }}>
              <div style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 12, background: "rgba(204,31,31,0.12)", color: "var(--ropesa-red)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={f.d} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: "var(--text)" }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Registro visible */}
      <div style={{ padding: "0 16px 8px" }} id="registro">
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ background: "linear-gradient(135deg, rgba(204,31,31,0.10), transparent)", borderColor: "rgba(204,31,31,0.25)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "var(--text)" }}>Solicita tu cuenta</h3>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16, lineHeight: 1.5 }}>Déjanos tus datos y un asesor activa tu operación. O entra directo a la demo sin registro.</p>
          {sent ? (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ padding: 16, borderRadius: 12, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--green)" }}>¡Solicitud recibida!</div>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Te contactaremos muy pronto.</p>
            </motion.div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input className="input" placeholder="Nombre del negocio" required />
              <input className="input" type="email" placeholder="Correo electrónico" required />
              <input className="input" placeholder="WhatsApp" required />
              <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>Crear mi cuenta</button>
            </form>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 11, color: "var(--muted-2)" }}>o</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
          <button className="btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={onEnterDemo}>Explorar la demo ahora</button>
        </motion.div>
      </div>
    </div>
  );
}
