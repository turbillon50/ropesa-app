"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Vendedor { id: number; nombre: string; zona: string; activo: boolean; telefono: string; }
interface Cliente { id: number; nombre: string; zona: string; saldo_pendiente: string; }
interface Pedido { id: number; folio: string; total: string; cobrado: string; estado: string; tipo: string; created_at: string; }
interface Visita { id: number; resultado: string; created_at: string; }

type Tab = "dashboard" | "vendedores" | "rutas" | "reportes" | "cobranza";

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
          fetch("/api/vendedores").then(r => r.json()),
          fetch("/api/clientes").then(r => r.json()),
          fetch("/api/pedidos").then(r => r.json()),
          fetch("/api/visitas").then(r => r.json()),
        ]);
        setVendedores(v.data || []);
        setClientes(c.data || []);
        setPedidos(p.data || []);
        setVisitas(vis.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const totalVentas = pedidos.reduce((s, p) => s + parseFloat(p.total || "0"), 0);
  const totalCobrado = pedidos.filter(p => p.estado === "cobrado").reduce((s, p) => s + parseFloat(p.cobrado || "0"), 0);
  const saldosPendientes = clientes.reduce((s, c) => s + parseFloat(c.saldo_pendiente || "0"), 0);
  const eficiencia = pedidos.length > 0 ? Math.round((pedidos.filter(p => p.estado === "cobrado").length / pedidos.length) * 100) : 0;

  const tabs = [
    { id: "dashboard" as Tab, icon: "📊", label: "Dashboard" },
    { id: "vendedores" as Tab, icon: "👥", label: "Equipo" },
    { id: "rutas" as Tab, icon: "🗺️", label: "Rutas" },
    { id: "cobranza" as Tab, icon: "💵", label: "Cobranza" },
    { id: "reportes" as Tab, icon: "📈", label: "Reportes" },
  ];

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 16 }}>
      <div style={{ width: 40, height: 40, border: "3px solid #222", borderTopColor: "#22C55E", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: "#666", fontSize: 13 }}>Cargando panel admin...</p>
    </div>
  );

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", paddingBottom: 80 }}>
      {/* Header Admin */}
      <div style={{ padding: "52px 16px 16px", background: "linear-gradient(180deg, rgba(34,197,94,0.08) 0%, transparent 100%)", borderBottom: "1px solid #1A1A1A" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>Panel Admin</p>
            <h1 style={{ fontSize: 22, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
              <span>⚙️</span> ROPESA
            </h1>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <span className="badge badge-green">● Operación activa</span>
              <span style={{ fontSize: 11, color: "#555" }}>Hoy {new Date().toLocaleDateString("es-MX")}</span>
            </div>
          </div>
          <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
            🏢
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "dashboard" && (
          <motion.div key="dash" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            {/* Métricas principales */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { v: `$${totalVentas.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`, l: "Ventas totales", c: "#CC1F1F", e: "💰", sub: "Todos los pedidos" },
                { v: `$${totalCobrado.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`, l: "Cobrado hoy", c: "#22C55E", e: "✅", sub: `${eficiencia}% efectividad` },
                { v: `$${saldosPendientes.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`, l: "Por cobrar", c: "#EAB308", e: "⏳", sub: "Saldos pendientes" },
                { v: `${vendedores.filter(v => v.activo).length}`, l: "Vendedores activos", c: "#3B82F6", e: "👥", sub: "En campo ahora" },
              ].map((s, i) => (
                <motion.div key={i} className="card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.08 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{s.e}</div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: "#ccc", marginTop: 2, fontWeight: 500 }}>{s.l}</div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{s.sub}</div>
                </motion.div>
              ))}
            </div>

            {/* Estado de rutas */}
            <motion.div className="card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>🗺️ Estado de rutas hoy</div>
              {[
                { name: "Ruta Centro A", vendedor: "Carlos M.", pct: 60, estado: "en_curso" },
                { name: "Ruta Norte B", vendedor: "Lupita G.", pct: 0, estado: "pendiente" },
                { name: "Ruta Sur C", vendedor: "Raúl T.", pct: 100, estado: "completada" },
                { name: "Ruta Oriente D", vendedor: "Ana J.", pct: 100, estado: "completada" },
              ].map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i + 0.4 }}
                  style={{ marginBottom: i < 3 ? 12 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{r.name}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "#666" }}>{r.vendedor}</span>
                      <span className={`badge badge-${r.estado === "completada" ? "green" : r.estado === "en_curso" ? "yellow" : "gray"}`} style={{ fontSize: 9 }}>
                        {r.estado}
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${r.pct}%`, background: r.estado === "completada" ? "linear-gradient(90deg, #22C55E, #4ADE80)" : r.estado === "en_curso" ? "linear-gradient(90deg, #EAB308, #FACC15)" : "#333" }} />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Últimos pedidos */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>Últimos movimientos</h3>
                <button onClick={() => setTab("reportes")} style={{ fontSize: 12, color: "#22C55E", background: "none", border: "none", cursor: "pointer" }}>Ver reporte →</button>
              </div>
              {pedidos.slice(0, 4).map((p, i) => (
                <motion.div key={p.id} className="card" style={{ marginBottom: 8, padding: "12px 16px" }}
                  initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.07 + 0.5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{p.folio}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>{p.tipo === "venta_bordo" ? "Venta a bordo" : "Preventa"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, color: "#CC1F1F" }}>${parseFloat(p.total).toLocaleString("es-MX")}</div>
                      <span className={`badge badge-${p.estado === "cobrado" ? "green" : p.estado === "entregado" ? "yellow" : p.estado === "cancelado" ? "red" : "blue"}`} style={{ fontSize: 9 }}>
                        {p.estado}
                      </span>
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
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>👥 Mi Equipo</h2>
              <button className="btn-primary" style={{ padding: "8px 14px", fontSize: 12 }}>+ Agregar</button>
            </div>

            {vendedores.map((v, i) => (
              <motion.div key={v.id} className="card" style={{ marginBottom: 12 }}
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: `hsl(${i * 60}, 60%, 20%)`, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, fontWeight: 700, color: `hsl(${i * 60}, 60%, 60%)`
                  }}>
                    {v.nombre.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{v.nombre}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Zona {v.zona} · {v.telefono}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <span className={`badge badge-${v.activo ? "green" : "gray"}`}>
                        {v.activo ? "● Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#CC1F1F" }}>
                      ${(Math.random() * 3000 + 500).toFixed(0)}
                    </div>
                    <div style={{ fontSize: 10, color: "#555" }}>hoy</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "rutas" && (
          <motion.div key="rutas" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🗺️ Control de Rutas</h2>

            {/* Mapa macro */}
            <div style={{
              background: "linear-gradient(135deg, #0D1117, #111827, #0D1117)",
              borderRadius: 16, height: 220, marginBottom: 20, position: "relative",
              border: "1px solid #282828", overflow: "hidden",
            }}>
              <div style={{ padding: 16 }}>
                <p style={{ color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>Vista general — Mérida</p>
              </div>
              {/* Vendedores simulados en mapa */}
              {[
                { top: "35%", left: "30%", name: "Carlos", color: "#CC1F1F", estado: "en_curso" },
                { top: "25%", left: "60%", name: "Lupita", color: "#3B82F6", estado: "pendiente" },
                { top: "65%", left: "40%", name: "Raúl", color: "#22C55E", estado: "completada" },
                { top: "55%", left: "70%", name: "Ana", color: "#22C55E", estado: "completada" },
              ].map((v, i) => (
                <div key={i} style={{ position: "absolute", top: v.top, left: v.left }}>
                  <div style={{
                    background: v.color, borderRadius: "50%", width: 32, height: 32,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, boxShadow: `0 0 12px ${v.color}66`, border: "2px solid white"
                  }}>🚚</div>
                  <div style={{ background: "rgba(0,0,0,0.8)", padding: "2px 6px", borderRadius: 4, fontSize: 9, color: "white", marginTop: 2, whiteSpace: "nowrap" }}>
                    {v.name}
                  </div>
                </div>
              ))}
              <div style={{ position: "absolute", top: 12, right: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                {[["🔴", "En ruta"], ["🟡", "Pendiente"], ["🟢", "Completada"]].map(([e, l], i) => (
                  <div key={i} style={{ display: "flex", gap: 4, alignItems: "center", fontSize: 10, color: "#aaa" }}>
                    <span>{e}</span><span>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detalle por ruta */}
            {[
              { ruta: "Ruta Centro A", vendedor: "Carlos Mendoza", clientes: 5, visitados: 3, ventas: 2860.50, estado: "en_curso" },
              { ruta: "Ruta Norte B", vendedor: "Lupita García", clientes: 6, visitados: 0, ventas: 0, estado: "pendiente" },
              { ruta: "Ruta Sur C", vendedor: "Raúl Torres", clientes: 4, visitados: 4, ventas: 1880.00, estado: "completada" },
              { ruta: "Ruta Oriente D", vendedor: "Ana Jiménez", clientes: 5, visitados: 5, ventas: 3400.00, estado: "completada" },
            ].map((r, i) => (
              <motion.div key={i} className="card" style={{ marginBottom: 10 }}
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.ruta}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{r.vendedor}</div>
                  </div>
                  <span className={`badge badge-${r.estado === "completada" ? "green" : r.estado === "en_curso" ? "yellow" : "gray"}`}>
                    {r.estado}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                  <div style={{ fontSize: 11 }}><span style={{ color: "#666" }}>Clientes: </span><span style={{ fontWeight: 600 }}>{r.visitados}/{r.clientes}</span></div>
                  <div style={{ fontSize: 11 }}><span style={{ color: "#666" }}>Ventas: </span><span style={{ fontWeight: 600, color: "#CC1F1F" }}>${r.ventas.toLocaleString("es-MX")}</span></div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${r.clientes > 0 ? (r.visitados / r.clientes) * 100 : 0}%`,
                    background: r.estado === "completada" ? "linear-gradient(90deg, #22C55E, #4ADE80)" : "linear-gradient(90deg, #CC1F1F, #FF4444)"
                  }} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "cobranza" && (
          <motion.div key="cobr" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>💵 Cobranza</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div className="card" style={{ borderColor: "rgba(34,197,94,0.3)" }}>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>Cobrado</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#22C55E" }}>${totalCobrado.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</div>
              </div>
              <div className="card" style={{ borderColor: "rgba(234,179,8,0.3)" }}>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>Pendiente</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#EAB308" }}>${saldosPendientes.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</div>
              </div>
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#888", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Clientes con saldo</h3>
            {clientes.filter(c => parseFloat(c.saldo_pendiente || "0") > 0).map((c, i) => (
              <motion.div key={c.id} className="card" style={{ marginBottom: 10, display: "flex", gap: 12, alignItems: "center" }}
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(234,179,8,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏪</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{c.nombre}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>{c.zona}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, color: "#EAB308", fontSize: 16 }}>
                    ${parseFloat(c.saldo_pendiente).toLocaleString("es-MX")}
                  </div>
                  <button className="btn-primary" style={{ fontSize: 11, padding: "4px 10px", marginTop: 4 }}>Cobrar</button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "reportes" && (
          <motion.div key="rep" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📈 Reportes</h2>

            {/* Resumen del día */}
            <motion.div className="card" style={{ marginBottom: 16, background: "linear-gradient(135deg, rgba(204,31,31,0.08), rgba(204,31,31,0.02))", borderColor: "rgba(204,31,31,0.2)" }}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>📋 Resumen del día</div>
              {[
                { l: "Pedidos totales", v: `${pedidos.length}` },
                { l: "Pedidos cobrados", v: `${pedidos.filter(p => p.estado === "cobrado").length}` },
                { l: "Preventa", v: `${pedidos.filter(p => p.tipo === "preventa").length}` },
                { l: "Venta a bordo", v: `${pedidos.filter(p => p.tipo === "venta_bordo").length}` },
                { l: "Visitas registradas", v: `${visitas.length}` },
                { l: "Clientes visitados", v: `${new Set(visitas.map(v => v.resultado !== "no_encontrado")).size}` },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 5 ? "1px solid #1A1A1A" : "none" }}>
                  <span style={{ fontSize: 13, color: "#888" }}>{item.l}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{item.v}</span>
                </div>
              ))}
            </motion.div>

            {/* Top vendedores */}
            <motion.div className="card" style={{ marginBottom: 16 }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>🏆 Top Vendedores</div>
              {vendedores.map((v, i) => {
                const ventas = [4260.50, 2200.00, 1880.00, 3400.00][i] || 0;
                return (
                  <div key={v.id} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: i < vendedores.length - 1 ? 12 : 0 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? "rgba(234,179,8,0.2)" : "rgba(102,102,102,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: i === 0 ? "#FACC15" : "#666" }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{v.nombre}</div>
                      <div className="progress-bar" style={{ marginTop: 4 }}>
                        <div className="progress-fill" style={{ width: `${(ventas / 4260.50) * 100}%` }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#CC1F1F" }}>${ventas.toLocaleString("es-MX")}</div>
                  </div>
                );
              })}
            </motion.div>

            {/* Botones exportar */}
            <motion.div style={{ display: "flex", gap: 10 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>📄 Exportar PDF</button>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>📊 Excel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav Admin */}
      <div className="bottom-nav">
        {tabs.map(t => (
          <button key={t.id} className={`nav-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}
            style={{ background: "none", border: "none", cursor: "pointer", color: tab === t.id ? "#22C55E" : undefined }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
