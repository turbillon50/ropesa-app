import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ROPESA — Vendedores en Ruta",
  description: "Plataforma de gestión para vendedores en ruta de Comercializadora ROPESA",
  manifest: "/manifest.json",
  themeColor: "#CC1F1F",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "ROPESA" },
  viewport: { width: "device-width", initialScale: 1, maximumScale: 1 },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
