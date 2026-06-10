"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VendedorApp from "@/components/VendedorApp";
import AdminApp from "@/components/AdminApp";
import LandingPublica from "@/components/LandingPublica";
import ModeSwitcher from "@/components/ModeSwitcher";

export default function Home() {
  const [splash, setSplash] = useState(true);
  const [mode, setMode] = useState<"publico" | "vendedor" | "admin">("publico");
  const [splashProgress, setSplashProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setSplashProgress(p => {
          if (p >= 100) { clearInterval(interval); setSplash(false); return 100; }
          return p + 4;
        });
      }, 40);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {splash && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{ background: "#0A0A0A" }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="flex flex-col items-center"
            >
              <div style={{ fontSize: 80 }}>🚚</div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontSize: 44, fontWeight: 900, letterSpacing: "0.1em",
                  background: "linear-gradient(135deg, #CC1F1F, #FF4444)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                ROPESA
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                style={{ color: "#666", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 8 }}
              >
                COMERCIALIZADORA
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{ marginTop: 48, width: 200 }}
            >
              <div style={{ height: 3, background: "#222", borderRadius: 99, overflow: "hidden" }}>
                <motion.div
                  style={{
                    height: "100%", background: "linear-gradient(90deg, #CC1F1F, #FF4444)",
                    borderRadius: 99, width: `${splashProgress}%`, transition: "width 0.1s linear"
                  }}
                />
              </div>
              <p style={{ color: "#555", fontSize: 10, textAlign: "center", marginTop: 8 }}>Cargando sistema...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!splash && (
        <>
          <AnimatePresence mode="wait">
            {mode === "publico" && (
              <motion.div key="publico" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <LandingPublica onEnterDemo={() => setMode("vendedor")} />
              </motion.div>
            )}
            {mode === "vendedor" && (
              <motion.div key="vendedor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <VendedorApp />
              </motion.div>
            )}
            {mode === "admin" && (
              <motion.div key="admin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <AdminApp />
              </motion.div>
            )}
          </AnimatePresence>
          <ModeSwitcher current={mode} onChange={setMode} />
        </>
      )}
    </>
  );
}
