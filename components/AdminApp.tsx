"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DEMO_CLIENTES, DEMO_PEDIDOS, DEMO_VENDEDORES, DEMO_VISITAS } from "@/lib/demo-data";

interface Vendedor { id: number; nombre: string; zona: string; activo: boolean; telefono: string; }
interface Cliente { id: number; nombre: string; zona: string; saldo_pendiente: string; }
interface Pedido { id: number; folio: string; total: string; cobrado: string; estado: string; tipo: string; created_at: string; }
interface Visita { id: number; resultado: string; created_at: string; }

type Tab = "dashboard" | "vendedores" | "rutas" | "reportes" | "cobranza";

const NavIcon = ({ k }: { k: Tab }) => {
  const p: Record<Tab, string> = {
    dashboard: "M4 19V5 M9 19v-7 M14 19V9 M19 19v-4",
    vendedores: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3 20a6 6 0 0 1 12 0 M17 11a3 3 0 0 0 0-6 M16 20a6 6 0 0 1 5-2.5",
    rutas: "M9 4l6 2 6-2v14l-6 2-6-2-6 2V6z M9 4v14 M15 6v14",
    cobranza: "M3 6h18v12H3z M3 10h18 M7 14h4",
    reportes: "M4 18l6-6 3 3 7-7 M14 8h5v5",
  };
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={p[k]} /></svg>;
};

export default function AdminApp() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [v, c, p, vis] = await Promise.all([
          fetch("/api/vendedores").then(r => r.json()).catch(() => ({})),
          fetch("/api/clientes").then(r => r.json()).catch(() => ({})),
          fetch("/api/pedidos").then(r => r.json()).catch(() => ({})),
          fetch("/api/visitas").then(r => r.json()).catch(() => ({})),
        ]);
        setVendedores(v.data?.length ? v.data : DEMO_VENDEDORES);
        setClientes(c.data?.length ? c.data : DEMO_CLIENTES);
        setPedidos(p.data?.length ? p.data : DEMO_PEDIDOS);
        setVisitas(vis.data?.length ? vis.data : DEMO_VISITAS);
      } catch {
        setVendedores(DEMO_VENDEDORES); setClientes(DEMO_CLIENTES); setPedidos(DEMO_PEDIDOS); setVisitas(DEMO_VISITAS);
      }
      setLoading(false);
    };
    load();
  }, []);

  const totalVentas = pedidos.reduce((s, p) => s + parseFloat(p.total || "0"), 0);
  const totalCobrado = pedidos.filter(p => p.estado === "cobrado").reduce((s, p) => s + parseFloat(p.cobrado || "0"), 0);
  const saldosPendientes = clientes.reduce((s, c) => s + parseFloat(c.saldo_pendiente || "0"), 0);
  const eficiencia = pedidos.length > 0 ? Math.round((pedidos.filter(p => p.estado === "cobrado").length / pedidos.length) * 100) : 0;

  const tabs: { id: Tab; label: string }[] = [
    { id: "dashboard", label: "Dashboard" }, { id: "vendedores", label: "Equipo" }, { id: "rutas", label: "Rutas" }, { id: "cobranza", label: "Cobranza" }, { id: "reportes", label: "Reportes" },
  ];

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 16 }}>
      <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--green)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: "var(--muted)", fontSize: 13 }}>Cargando panel admin...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ padding: "52px 16px 16px", background: "linear-gradient(180deg, rgba(34,197,94,0.10) 0%, transparent 100%)", borderBottom: "1px solid var(--border-soft)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>Panel Admin</p>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>ROPESA</h1>
            <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
              <span className="badge badge-green">● Operación activa</span>
              <span style={{ fontSize: 11, color: "var(--muted-2)" }}>Hoy {new Date().toLocaleDateString("es-MX")}</span>
            </div>
          </div>
          <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "var(--green)", borderRadius: 12, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V8l9-5 9 5v13 M3 21h18 M9 21v-6h6v6" /></svg>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "dashboard" && (
          <motion.div key="dash" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ borderRadius: 16, overflow: "hidden", marginBottom: 16, position: "relative", height: 120 }}>
              <img src="/images/equipo.jpg" alt="Equipo ROPESA" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(8,30,16,0.85), rgba(34,197,94,0.10))", display: "flex", flexDirection: "column", justifyContent: "center", padding: 18 }}>
                <div style={{ color: "white", fontSize: 16, fontWeight: 800 }}>Operación del día</div>
                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}>{vendedores.filter(v => v.activo).length} vendedores en campo · {eficiencia}% efectividad</div>
              </div>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { v: `$${totalVentas.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`, l: "Ventas totales", c: "var(--ropesa-red)", sub: "Todos los pedidos" },
                { v: `$${totalCobrado.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`, l: "Cobrado hoy", c: "var(--green)", sub: `${eficiencia}% efectividad` },
                { v: `$${saldosPendientes.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`, l: "Por cobrar", c: "var(--yellow)", sub: "Saldos pendientes" },
                { v: `${vendedores.filter(v => v.activo).length}`, l: "Vendedores activos", c: "var(--blue)", sub: "En campo ahora" },
              ].map((s, i) => (
                <motion.div key={i} className="card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.08 }} style={{ padding: 16 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: "var(--text)", marginTop: 2, fontWeight: 500 }}>{s.l}</div>
                  <div style={{ fontSize: 10, color: "var(--muted-2)", marginTop: 2 }}>{s.sub}</div>
                </motion.div>
              ))}
            </div>

            <motion.div className="card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15, color: "var(--text)" }}>Estado de rutas hoy</div>
              {[
                { name: "Ruta Centro A", vendedor: "Carlos M.", pct: 60, estado: "en_curso" },
                { name: "Ruta Norte B", vendedor: "Lupita G.", pct: 0, estado: "pendiente" },
                { name: "Ruta Sur C", vendedor: "Raúl T.", pct: 100, estado: "completada" },
                { name: "Ruta Oriente D", vendedor: "Ana J.", pct: 100, estado: "completada" },
              ].map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i + 0.4 }} style={{ marginBottom: i < 3 ? 12 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{r.name}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>{r.vendedor}</span>
                      <span className={`badge badge-${r.estado === "completada" ? "green" : r.estado === "en_curso" ? "yellow" : "gray"}`} style={{ fontSize: 9 }}>{r.estado}</span>
                    </div>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${r.pct}%`, background: r.estado === "completada" ? "linear-gradient(90deg, #22C55E, #4ADE80)" : r.estado === "en_curso" ? "linear-gradient(90deg, #EAB308, #FACC15)" : "var(--border)" }} /></div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Últimos movimientos</h3>
                <button onClick={() => setTab("reportes")} style={{ fontSize: 12, color: "var(--green)", background: "none", border: "none", cursor: "pointer" }}>Ver reporte →</button>
              </div>
              {pedidos.slice(0, 4).map((p, i) => (
                <motion.div key={p.id} className="card" style={{ marginBottom: 8, padding: "12px 16px" }} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.07 + 0.5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{p.folio}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{p.tipo === "venta_bordo" ? "Venta a bordo" : "Preventa"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, color: "var(--ropesa-red)" }}>${parseFloat(p.total).toLocaleString("es-MX")}</div>
                      <span className={`badge badge-${p.estado === "cobrado" ? "green" : p.estado === "entregado" ? "yellow" : p.estado === "cancelado" ? "red" : "blue"}`} style={{ fontSize: 9 }}>{p.estado}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {tab === "vendedores" && (
          <motion.div key="vend" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>Mi Equipo</h2>
              <button className="btn-primary" style={{ padding: "8px 14px", fontSize: 12 }}>+ Agregar</button>
            </div>
            {vendedores.map((v, i) => (
              <motion.div key={v.id} className="card" style={{ marginBottom: 12 }} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `hsl(${i * 60}, 55%, 88%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: `hsl(${i * 60}, 55%, 35%)` }}>
                    {v.nombre.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{v.nombre}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Zona {v.zona} · {v.telefono}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <span className={`badge badge-${v.activo ? "green" : "gray"}`}>{v.activo ? "● Activo" : "Inactivo"}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ropesa-red)" }}>${[4260, 2200, 1880, 3400][i] || 0}</div>
                    <div style={{ fontSize: 10, color: "var(--muted-2)" }}>hoy</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "rutas" && (
          <motion.div key="rutas" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>Control de Rutas</h2>
            <div style={{ borderRadius: 16, height: 200, marginBottom: 20, position: "relative", border: "1px solid var(--border)", overflow: "hidden" }}>
              <img src="/images/ruta.jpg" alt="Mapa general" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
              {[
                { top: "35%", left: "30%", name: "Carlos", color: "#CC1F1F" },
                { top: "25%", left: "60%", name: "Lupita", color: "#3B82F6" },
                { top: "65%", left: "40%", name: "Raúl", color: "#22C55E" },
                { top: "55%", left: "70%", name: "Ana", color: "#22C55E" },
              ].map((v, i) => (
                <div key={i} style={{ position: "absolute", top: v.top, left: v.left, textAlign: "center" }}>
                  <div style={{ background: v.color, borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: `0 0 12px ${v.color}99`, border: "2px solid white", margin: "0 auto" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h11v8H2zM13 10h4l3 3v2h-7z" /></svg>
                  </div>
                  <div style={{ background: "rgba(0,0,0,0.75)", padding: "2px 6px", borderRadius: 4, fontSize: 9, color: "white", marginTop: 2, whiteSpace: "nowrap" }}>{v.name}</div>
                </div>
              ))}
            </div>
            {[
              { ruta: "Ruta Centro A", vendedor: "Carlos Mendoza", clientes: 5, visitados: 3, ventas: 2860.50, estado: "en_curso" },
              { ruta: "Ruta Norte B", vendedor: "Lupita García", clientes: 6, visitados: 0, ventas: 0, estado: "pendiente" },
              { ruta: "Ruta Sur C", vendedor: "Raúl Torres", clientes: 4, visitados: 4, ventas: 1880.00, estado: "completada" },
              { ruta: "Ruta Oriente D", vendedor: "Ana Jiménez", clientes: 5, visitados: 5, ventas: 3400.00, estado: "completada" },
            ].map((r, i) => (
              <motion.div key={i} className="card" style={{ marginBottom: 10 }} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{r.ruta}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.vendedor}</div>
                  </div>
                  <span className={`badge badge-${r.estado === "completada" ? "green" : r.estado === "en_curso" ? "yellow" : "gray"}`}>{r.estado}</span>
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>Clientes: <span style={{ fontWeight: 600, color: "var(--text)" }}>{r.visitados}/{r.clientes}</span></div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>Ventas: <span style={{ fontWeight: 600, color: "var(--ropesa-red)" }}>${r.ventas.toLocaleString("es-MX")}</span></div>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${r.clientes > 0 ? (r.visitados / r.clientes) * 100 : 0}%`, background: r.estado === "completada" ? "linear-gradient(90deg, #22C55E, #4ADE80)" : "linear-gradient(90deg, #CC1F1F, #FF4444)" }} /></div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "cobranza" && (
          <motion.div key="cobr" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>Cobranza</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div className="card" style={{ borderColor: "rgba(34,197,94,0.3)" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Cobrado</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--green)" }}>${totalCobrado.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</div>
              </div>
              <div className="card" style={{ borderColor: "rgba(234,179,8,0.3)" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Pendiente</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--yellow)" }}>${saldosPendientes.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</div>
              </div>
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Clientes con saldo</h3>
            {clientes.filter(c => parseFloat(c.saldo_pendiente || "0") > 0).map((c, i) => (
              <motion.div key={c.id} className="card" style={{ marginBottom: 10, display: "flex", gap: 12, alignItems: "center" }} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(234,179,8,0.15)", color: "var(--yellow)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v4H4z M6 8v12h12V8 M10 12h4" /></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{c.nombre}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.zona}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, color: "var(--yellow)", fontSize: 16 }}>${parseFloat(c.saldo_pendiente).toLocaleString("es-MX")}</div>
                  <button className="btn-primary" style={{ fontSize: 11, padding: "4px 10px", marginTop: 4 }}>Cobrar</button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "reportes" && (
          <motion.div key="rep" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>Reportes</h2>
            <motion.div className="card" style={{ marginBottom: 16, background: "linear-gradient(135deg, rgba(204,31,31,0.08), transparent)", borderColor: "rgba(204,31,31,0.2)" }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12, color: "var(--text)" }}>Resumen del día</div>
              {[
                { l: "Pedidos totales", v: `${pedidos.length}` },
                { l: "Pedidos cobrados", v: `${pedidos.filter(p => p.estado === "cobrado").length}` },
                { l: "Preventa", v: `${pedidos.filter(p => p.tipo === "preventa").length}` },
                { l: "Venta a bordo", v: `${pedidos.filter(p => p.tipo === "venta_bordo").length}` },
                { l: "Visitas registradas", v: `${visitas.length}` },
              ].map((item, i, arr) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border-soft)" : "none" }}>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>{item.l}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{item.v}</span>
                </div>
              ))}
            </motion.div>
            <motion.div className="card" style={{ marginBottom: 16 }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: "var(--text)" }}>Top Vendedores</div>
              {vendedores.map((v, i) => {
                const ventas = [4260.50, 3400.00, 2200.00, 1880.00][i] || 0;
                return (
                  <div key={v.id} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: i < vendedores.length - 1 ? 12 : 0 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? "rgba(234,179,8,0.2)" : "rgba(136,143,152,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: i === 0 ? "#B7860B" : "var(--muted)" }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{v.nombre}</div>
                      <div className="progress-bar" style={{ marginTop: 4 }}><div className="progress-fill" style={{ width: `${(ventas / 4260.50) * 100}%` }} /></div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ropesa-red)" }}>${ventas.toLocaleString("es-MX")}</div>
                  </div>
                );
              })}
            </motion.div>
            <motion.div style={{ display: "flex", gap: 10 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Exportar PDF</button>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Excel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bottom-nav">
        {tabs.map(t => (
          <button key={t.id} className={`nav-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}
            style={{ background: "none", border: "none", cursor: "pointer", color: tab === t.id ? "var(--green)" : undefined }}>
            <NavIcon k={t.id} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
