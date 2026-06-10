"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DEMO_CLIENTES, DEMO_PEDIDOS, DEMO_PRODUCTOS, DEMO_VISITAS } from "@/lib/demo-data";

interface Cliente { id: number; nombre: string; direccion: string; zona: string; saldo_pendiente: string; }
interface Pedido { id: number; folio: string; total: string; cobrado: string; estado: string; tipo: string; created_at: string; cliente_nombre?: string; }
interface Producto { id: number; nombre: string; categoria: string; precio: string; stock_total: number; unidad: string; }
interface Visita { id: number; resultado: string; notas: string; created_at: string; cliente_nombre?: string; }

type Tab = "home" | "ruta" | "pedidos" | "catalogo" | "clientes";

const NavIcon = ({ k }: { k: Tab }) => {
  const p: Record<Tab, string> = {
    home: "M3 11l9-8 9 8 M5 10v10h14V10",
    ruta: "M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z M12 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
    pedidos: "M5 3h11l3 3v15H5z M9 8h6 M9 12h6 M9 16h4",
    catalogo: "M3 7h13v10H3z M16 10h3l2 3v4h-5z M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
    clientes: "M4 4h16v4H4z M6 8v12h12V8 M10 12h4",
  };
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={p[k]} /></svg>;
};

export default function VendedorApp() {
  const [tab, setTab] = useState<Tab>("home");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [c, p, pr, v] = await Promise.all([
          fetch("/api/clientes").then(r => r.json()).catch(() => ({})),
          fetch("/api/pedidos").then(r => r.json()).catch(() => ({})),
          fetch("/api/productos").then(r => r.json()).catch(() => ({})),
          fetch("/api/visitas").then(r => r.json()).catch(() => ({})),
        ]);
        setClientes(c.data?.length ? c.data : DEMO_CLIENTES);
        setPedidos(p.data?.length ? p.data : DEMO_PEDIDOS);
        setProductos(pr.data?.length ? pr.data : DEMO_PRODUCTOS);
        setVisitas(v.data?.length ? v.data : DEMO_VISITAS);
      } catch {
        setClientes(DEMO_CLIENTES); setPedidos(DEMO_PEDIDOS); setProductos(DEMO_PRODUCTOS); setVisitas(DEMO_VISITAS);
      }
      setLoading(false);
    };
    load();
  }, []);

  const totalVentas = pedidos.filter(p => p.estado !== "cancelado").reduce((s, p) => s + parseFloat(p.total || "0"), 0);
  const cobrado = pedidos.filter(p => p.estado === "cobrado").reduce((s, p) => s + parseFloat(p.cobrado || "0"), 0);
  const pendientesCobro = pedidos.filter(p => p.estado === "entregado").length;
  const visitasHoy = visitas.length;

  const tabs: { id: Tab; label: string }[] = [
    { id: "home", label: "Inicio" }, { id: "ruta", label: "Mi Ruta" }, { id: "pedidos", label: "Pedidos" }, { id: "catalogo", label: "Catálogo" }, { id: "clientes", label: "Clientes" },
  ];

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 16 }}>
      <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--ropesa-red)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: "var(--muted)", fontSize: 13 }}>Cargando datos...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ padding: "52px 16px 16px", background: "linear-gradient(180deg, rgba(204,31,31,0.10) 0%, transparent 100%)", borderBottom: "1px solid var(--border-soft)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>Vendedor</p>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>Carlos Mendoza</h1>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <span className="badge badge-green">● En ruta</span>
              <span className="badge badge-gray">Zona Centro</span>
            </div>
          </div>
          <img src="/images/logo.jpg" alt="ROPESA" style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover", boxShadow: "0 4px 14px rgba(204,31,31,0.3)" }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "home" && (
          <motion.div key="home" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              style={{ borderRadius: 16, overflow: "hidden", marginBottom: 16, position: "relative", height: 130 }}>
              <img src="/images/hero.jpg" alt="Ruta" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(204,31,31,0.85), rgba(204,31,31,0.15))", display: "flex", flexDirection: "column", justifyContent: "center", padding: 18 }}>
                <div style={{ color: "white", fontSize: 16, fontWeight: 800 }}>¡Buen día, Carlos!</div>
                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}>Tienes 2 clientes pendientes hoy</div>
              </div>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { v: `$${totalVentas.toLocaleString("es-MX", { minimumFractionDigits: 0 })}`, l: "Total vendido", c: "var(--ropesa-red)" },
                { v: `$${cobrado.toLocaleString("es-MX", { minimumFractionDigits: 0 })}`, l: "Cobrado", c: "var(--green)" },
                { v: `${pendientesCobro}`, l: "Pendientes cobro", c: "var(--yellow)" },
                { v: `${visitasHoy}`, l: "Visitas hoy", c: "var(--blue)" },
              ].map((s, i) => (
                <motion.div key={i} className="card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.08 }} style={{ padding: 16 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{s.l}</div>
                </motion.div>
              ))}
            </div>

            <motion.div className="card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 600, color: "var(--text)" }}>Progreso de hoy</span>
                <span style={{ color: "var(--ropesa-red)", fontWeight: 700 }}>3/5 visitas</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: "60%" }} /></div>
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>2 clientes pendientes en ruta Centro A</p>
            </motion.div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Pedidos recientes</h2>
                <button onClick={() => setTab("pedidos")} style={{ fontSize: 12, color: "var(--ropesa-red)", background: "none", border: "none", cursor: "pointer" }}>Ver todos</button>
              </div>
              {pedidos.slice(0, 3).map((p, i) => (
                <motion.div key={p.id} className="card" style={{ marginBottom: 8 }} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 * i + 0.4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{p.folio}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{p.tipo === "venta_bordo" ? "Venta a bordo" : "Preventa"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, color: "var(--ropesa-red)" }}>${parseFloat(p.total).toLocaleString("es-MX")}</div>
                      <span className={`badge badge-${p.estado === "cobrado" ? "green" : p.estado === "entregado" ? "yellow" : p.estado === "cancelado" ? "red" : "blue"}`}>{p.estado}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14 }} onClick={() => setTab("clientes")}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} whileTap={{ scale: 0.97 }}>+ Nuevo Pedido</motion.button>
          </motion.div>
        )}

        {tab === "ruta" && (
          <motion.div key="ruta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>Mi Ruta Hoy</h2>
            <div style={{ borderRadius: 16, height: 200, marginBottom: 16, position: "relative", border: "1px solid var(--border)", overflow: "hidden" }}>
              <img src="/images/ruta.jpg" alt="Mapa de ruta" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.45))" }} />
              <div style={{ position: "absolute", bottom: 10, left: 12, color: "white", fontSize: 12, fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>Ruta Centro A — Mérida, Yucatán</div>
              {[{ top: "30%", left: "25%", done: true }, { top: "50%", left: "45%", done: true }, { top: "40%", left: "65%", done: true }, { top: "65%", left: "55%", done: false }, { top: "55%", left: "30%", done: false }].map((pt, i) => (
                <div key={i} style={{ position: "absolute", top: pt.top, left: pt.left, width: 14, height: 14, borderRadius: "50%", background: pt.done ? "#22C55E" : "#CC1F1F", border: "2px solid white", boxShadow: `0 0 8px ${pt.done ? "rgba(34,197,94,0.7)" : "rgba(204,31,31,0.7)"}` }} />
              ))}
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Clientes asignados</h3>
            {clientes.slice(0, 5).map((c, i) => (
              <motion.div key={c.id} className="card" style={{ marginBottom: 8, display: "flex", gap: 12, alignItems: "center" }} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: i < 3 ? "rgba(34,197,94,0.15)" : "rgba(204,31,31,0.15)", color: i < 3 ? "var(--green)" : "var(--ropesa-red)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{i < 3 ? <path d="M5 13l4 4L19 7" /> : <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z" />}</svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{c.nombre}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.direccion}</div>
                </div>
                {parseFloat(c.saldo_pendiente || "0") > 0 && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "var(--yellow)", fontWeight: 600 }}>${parseFloat(c.saldo_pendiente).toLocaleString("es-MX")}</div>
                    <div style={{ fontSize: 10, color: "var(--muted-2)" }}>pendiente</div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "pedidos" && (
          <motion.div key="pedidos" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>Mis Pedidos</h2>
              <button className="btn-primary" style={{ padding: "8px 14px", fontSize: 12 }} onClick={() => setTab("clientes")}>+ Nuevo</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
              {["Todos", "Pendiente", "Entregado", "Cobrado"].map((f, idx) => (
                <button key={f} style={{ padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 500, background: idx === 0 ? "var(--ropesa-red)" : "var(--surface-3)", color: idx === 0 ? "white" : "var(--muted)", border: "1px solid var(--border)", cursor: "pointer", whiteSpace: "nowrap" }}>{f}</button>
              ))}
            </div>
            {pedidos.map((p, i) => (
              <motion.div key={p.id} className="card" style={{ marginBottom: 10 }} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.06 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{p.folio}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{new Date(p.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short" })} · {p.tipo === "venta_bordo" ? "Venta a bordo" : "Preventa"}</div>
                  </div>
                  <span className={`badge badge-${p.estado === "cobrado" ? "green" : p.estado === "entregado" ? "yellow" : p.estado === "cancelado" ? "red" : "blue"}`}>{p.estado}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>Total</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "var(--ropesa-red)" }}>${parseFloat(p.total).toLocaleString("es-MX")}</div>
                  </div>
                  {parseFloat(p.cobrado || "0") < parseFloat(p.total) && p.estado !== "cancelado" && (
                    <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 12 }}>Cobrar</button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "catalogo" && (
          <motion.div key="catalogo" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, color: "var(--text)" }}>Catálogo de Productos</h2>
            <div style={{ borderRadius: 14, overflow: "hidden", height: 110, marginBottom: 16, position: "relative" }}>
              <img src="/images/catalogo.jpg" alt="Productos" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.5), transparent)", display: "flex", alignItems: "center", padding: 16 }}>
                <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{productos.length} productos disponibles</span>
              </div>
            </div>
            <input className="input" placeholder="Buscar producto..." style={{ marginBottom: 16 }} />
            {Array.from(new Set(productos.map(p => p.categoria))).map(cat => (
              <div key={cat} style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{cat}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {productos.filter(p => p.categoria === cat).map((prod, i) => (
                    <motion.div key={prod.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14 }} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{prod.nombre}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Stock: {prod.stock_total} {prod.unidad}s</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 800, color: "var(--ropesa-red)", fontSize: 16 }}>${parseFloat(prod.precio).toFixed(2)}</div>
                        <div style={{ fontSize: 10, color: "var(--muted-2)" }}>por {prod.unidad}</div>
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
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>Mis Clientes</h2>
            <input className="input" placeholder="Buscar cliente..." style={{ marginBottom: 16 }} />
            {clientes.map((c, i) => (
              <motion.div key={c.id} className="card" style={{ marginBottom: 10, cursor: "pointer" }} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.07 }}
                onClick={() => setSelectedCliente(selectedCliente?.id === c.id ? null : c)}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(204,31,31,0.15)", color: "var(--ropesa-red)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v4H4z M6 8v12h12V8 M10 12h4" /></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{c.nombre}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{c.direccion}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <span className="badge badge-gray">{c.zona}</span>
                      {parseFloat(c.saldo_pendiente || "0") > 0 && (<span className="badge badge-yellow">Saldo: ${parseFloat(c.saldo_pendiente).toLocaleString("es-MX")}</span>)}
                    </div>
                  </div>
                </div>
                {selectedCliente?.id === c.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="btn-primary" style={{ fontSize: 12, padding: "8px 14px" }}>Nuevo pedido</button>
                    <button className="btn-ghost" style={{ fontSize: 12, padding: "8px 14px" }}>Llamar</button>
                    <button className="btn-ghost" style={{ fontSize: 12, padding: "8px 14px" }}>Ver en mapa</button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bottom-nav">
        {tabs.map(t => (
          <button key={t.id} className={`nav-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <NavIcon k={t.id} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
