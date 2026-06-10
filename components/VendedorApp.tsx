"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Cliente { id: number; nombre: string; direccion: string; zona: string; saldo_pendiente: string; }
interface Pedido { id: number; folio: string; total: string; cobrado: string; estado: string; tipo: string; created_at: string; cliente_nombre?: string; }
interface Producto { id: number; nombre: string; categoria: string; precio: string; stock_total: number; unidad: string; }
interface Visita { id: number; resultado: string; notas: string; created_at: string; cliente_nombre?: string; }

type Tab = "home" | "ruta" | "pedidos" | "catalogo" | "clientes";

export default function VendedorApp() {
  const [tab, setTab] = useState<Tab>("home");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPedido, setShowNewPedido] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [c, p, pr, v] = await Promise.all([
          fetch("/api/clientes").then(r => r.json()),
          fetch("/api/pedidos").then(r => r.json()),
          fetch("/api/productos").then(r => r.json()),
          fetch("/api/visitas").then(r => r.json()),
        ]);
        setClientes(c.data || []);
        setPedidos(p.data || []);
        setProductos(pr.data || []);
        setVisitas(v.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const totalVentas = pedidos.filter(p => p.estado !== "cancelado").reduce((s, p) => s + parseFloat(p.total || "0"), 0);
  const cobrado = pedidos.filter(p => p.estado === "cobrado").reduce((s, p) => s + parseFloat(p.cobrado || "0"), 0);
  const pendientesCobro = pedidos.filter(p => p.estado === "entregado").length;
  const visitasHoy = visitas.length;

  const tabs = [
    { id: "home" as Tab, icon: "🏠", label: "Inicio" },
    { id: "ruta" as Tab, icon: "📍", label: "Mi Ruta" },
    { id: "pedidos" as Tab, icon: "📋", label: "Pedidos" },
    { id: "catalogo" as Tab, icon: "📦", label: "Catálogo" },
    { id: "clientes" as Tab, icon: "🏪", label: "Clientes" },
  ];

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 16 }}>
      <div style={{ width: 40, height: 40, border: "3px solid #222", borderTopColor: "#CC1F1F", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: "#666", fontSize: 13 }}>Cargando datos...</p>
    </div>
  );

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: "52px 16px 16px", background: "linear-gradient(180deg, rgba(204,31,31,0.08) 0%, transparent 100%)", borderBottom: "1px solid #1A1A1A" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>Vendedor</p>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>Carlos Mendoza</h1>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <span className="badge badge-green">● En ruta</span>
              <span className="badge badge-gray">Zona Centro</span>
            </div>
          </div>
          <div style={{ background: "#CC1F1F", borderRadius: 12, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
            🚚
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "home" && (
          <motion.div key="home" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { v: `$${totalVentas.toLocaleString("es-MX", { minimumFractionDigits: 0 })}`, l: "Total vendido", c: "#CC1F1F", e: "💰" },
                { v: `$${cobrado.toLocaleString("es-MX", { minimumFractionDigits: 0 })}`, l: "Cobrado", c: "#22C55E", e: "✅" },
                { v: `${pendientesCobro}`, l: "Pendientes cobro", c: "#EAB308", e: "⏳" },
                { v: `${visitasHoy}`, l: "Visitas hoy", c: "#3B82F6", e: "📍" },
              ].map((s, i) => (
                <motion.div key={i} className="card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.08 }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{s.e}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{s.l}</div>
                </motion.div>
              ))}
            </div>

            {/* Progreso ruta */}
            <motion.div className="card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>Progreso de hoy</span>
                <span style={{ color: "#CC1F1F", fontWeight: 700 }}>3/5 visitas</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "60%" }} />
              </div>
              <p style={{ fontSize: 11, color: "#666", marginTop: 6 }}>2 clientes pendientes en ruta Centro A</p>
            </motion.div>

            {/* Últimos pedidos */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Pedidos recientes</h2>
                <button onClick={() => setTab("pedidos")} style={{ fontSize: 12, color: "#CC1F1F", background: "none", border: "none", cursor: "pointer" }}>Ver todos</button>
              </div>
              {pedidos.slice(0, 3).map((p, i) => (
                <motion.div key={p.id} className="card" style={{ marginBottom: 8 }} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 * i + 0.4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{p.folio}</div>
                      <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{p.tipo === "venta_bordo" ? "Venta a bordo" : "Preventa"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, color: "#CC1F1F" }}>${parseFloat(p.total).toLocaleString("es-MX")}</div>
                      <span className={`badge badge-${p.estado === "cobrado" ? "green" : p.estado === "entregado" ? "yellow" : p.estado === "cancelado" ? "red" : "blue"}`}>
                        {p.estado}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA nuevo pedido */}
            <motion.button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14 }}
              onClick={() => setTab("clientes")}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              whileTap={{ scale: 0.97 }}>
              + Nuevo Pedido
            </motion.button>
          </motion.div>
        )}

        {tab === "ruta" && (
          <motion.div key="ruta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📍 Mi Ruta Hoy</h2>

            {/* Mapa simulado */}
            <div style={{
              background: "linear-gradient(135deg, #0D1117, #111827)",
              borderRadius: 16, height: 200, marginBottom: 16, position: "relative",
              border: "1px solid #282828", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🗺️</div>
                <p style={{ color: "#666", fontSize: 12 }}>Ruta Centro A — Mérida, Yucatán</p>
                {/* Puntos simulados */}
                {[
                  { top: "30%", left: "25%", done: true },
                  { top: "50%", left: "45%", done: true },
                  { top: "40%", left: "65%", done: true },
                  { top: "65%", left: "55%", done: false },
                  { top: "55%", left: "30%", done: false },
                ].map((p, i) => (
                  <div key={i} style={{
                    position: "absolute", top: p.top, left: p.left,
                    width: 14, height: 14, borderRadius: "50%",
                    background: p.done ? "#22C55E" : "#CC1F1F",
                    border: "2px solid white",
                    boxShadow: `0 0 8px ${p.done ? "rgba(34,197,94,0.6)" : "rgba(204,31,31,0.6)"}`
                  }} />
                ))}
              </div>
            </div>

            {/* Lista de clientes en ruta */}
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#888", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Clientes asignados</h3>
            {clientes.slice(0, 5).map((c, i) => (
              <motion.div key={c.id} className="card" style={{ marginBottom: 8, display: "flex", gap: 12, alignItems: "center" }}
                initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: i < 3 ? "rgba(34,197,94,0.15)" : "rgba(204,31,31,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0
                }}>
                  {i < 3 ? "✅" : "📍"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{c.nombre}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>{c.direccion}</div>
                </div>
                {parseFloat(c.saldo_pendiente || "0") > 0 && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "#EAB308", fontWeight: 600 }}>
                      ${parseFloat(c.saldo_pendiente).toLocaleString("es-MX")}
                    </div>
                    <div style={{ fontSize: 10, color: "#666" }}>pendiente</div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "pedidos" && (
          <motion.div key="pedidos" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>📋 Mis Pedidos</h2>
              <button className="btn-primary" style={{ padding: "8px 14px", fontSize: 12 }} onClick={() => setTab("clientes")}>
                + Nuevo
              </button>
            </div>

            {/* Filtros */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
              {["Todos", "Pendiente", "Entregado", "Cobrado"].map(f => (
                <button key={f} style={{
                  padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 500,
                  background: f === "Todos" ? "#CC1F1F" : "#1A1A1A",
                  color: f === "Todos" ? "white" : "#888", border: "1px solid #282828",
                  cursor: "pointer", whiteSpace: "nowrap"
                }}>{f}</button>
              ))}
            </div>

            {pedidos.map((p, i) => (
              <motion.div key={p.id} className="card" style={{ marginBottom: 10 }}
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.06 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{p.folio}</div>
                    <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
                      {new Date(p.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                      {" · "}{p.tipo === "venta_bordo" ? "🚚 Venta a bordo" : "📝 Preventa"}
                    </div>
                  </div>
                  <span className={`badge badge-${p.estado === "cobrado" ? "green" : p.estado === "entregado" ? "yellow" : p.estado === "cancelado" ? "red" : "blue"}`}>
                    {p.estado}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#666" }}>Total</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#CC1F1F" }}>${parseFloat(p.total).toLocaleString("es-MX")}</div>
                  </div>
                  {parseFloat(p.cobrado || "0") < parseFloat(p.total) && p.estado !== "cancelado" && (
                    <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 12 }}>
                      Cobrar
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "catalogo" && (
          <motion.div key="catalogo" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📦 Catálogo de Productos</h2>

            <input className="input" placeholder="🔍 Buscar producto..." style={{ marginBottom: 16 }} />

            {/* Categorías */}
            {Array.from(new Set(productos.map(p => p.categoria))).map(cat => (
              <div key={cat} style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{cat}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {productos.filter(p => p.categoria === cat).map((prod, i) => (
                    <motion.div key={prod.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14 }}
                      initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{prod.nombre}</div>
                        <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>Stock: {prod.stock_total} {prod.unidad}s</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 800, color: "#CC1F1F", fontSize: 16 }}>${parseFloat(prod.precio).toFixed(2)}</div>
                        <div style={{ fontSize: 10, color: "#555" }}>por {prod.unidad}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {tab === "clientes" && (
          <motion.div key="clientes" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🏪 Mis Clientes</h2>
            <input className="input" placeholder="🔍 Buscar cliente..." style={{ marginBottom: 16 }} />

            {clientes.map((c, i) => (
              <motion.div key={c.id} className="card" style={{ marginBottom: 10 }}
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.07 }}
                onClick={() => setSelectedCliente(selectedCliente?.id === c.id ? null : c)}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(204,31,31,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    🏪
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{c.nombre}</div>
                    <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{c.direccion}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <span className="badge badge-gray">{c.zona}</span>
                      {parseFloat(c.saldo_pendiente || "0") > 0 && (
                        <span className="badge badge-yellow">Saldo: ${parseFloat(c.saldo_pendiente).toLocaleString("es-MX")}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones cuando está seleccionado */}
                {selectedCliente?.id === c.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="btn-primary" style={{ fontSize: 12, padding: "8px 14px" }}>📝 Nuevo pedido</button>
                    <button className="btn-ghost" style={{ fontSize: 12, padding: "8px 14px" }}>📞 Llamar</button>
                    <button className="btn-ghost" style={{ fontSize: 12, padding: "8px 14px" }}>📍 Ver en mapa</button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        {tabs.map(t => (
          <button key={t.id} className={`nav-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}
            style={{ background: "none", border: "none", cursor: "pointer" }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
