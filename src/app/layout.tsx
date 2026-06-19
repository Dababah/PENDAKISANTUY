// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PendakiSantuy - Sewa Alat Daki & Camping",
  description:
    "Sewa alat pendakian & camping terlengkap. Tenda, carrier, sleeping bag, dan aksesoris outdoor berkualitas. Pesan via WhatsApp, respon cepat!",
  keywords: "sewa alat daki, rental camping, tenda, carrier, sleeping bag",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
