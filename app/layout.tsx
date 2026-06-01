import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Novi Pak — Prerada i pakovanje snack proizvoda",
  description:
    "Novi Pak Premijum doo Niš — prerada i pakovanje snack proizvoda, praškastih proizvoda i začina. Više od dve decenije tradicije.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
