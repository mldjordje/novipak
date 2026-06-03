import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Novi Pak - Premium snack proizvodi i pakovanje",
  description:
    "Novi Pak Premijum doo Niš - premium snack proizvodi, praškasti proizvodi, začini i uslužno pakovanje za partnere.",
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
          href="https://fonts.googleapis.com/css2?family=Anton&family=Bahiana&family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
