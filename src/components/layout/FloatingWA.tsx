"use client";
// src/components/layout/FloatingWA.tsx
import { MessageCircle } from "lucide-react";

export default function FloatingWA() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281234567890";
  const msg = encodeURIComponent("Halo Admin PendakiSantuy, saya ingin bertanya tentang sewa alat...");

  return (
    <a
      href={`https://wa.me/${wa}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
      aria-label="Chat WhatsApp"
    >
      <MessageCircle className="w-7 h-7 fill-white" />
    </a>
  );
}
