// src/components/layout/Footer.tsx
import Link from "next/link";
import { Mountain, MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281234567890";

  return (
    <footer className="bg-forest-900 text-stone-200">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-forest-500 rounded-xl flex items-center justify-center">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-lg leading-none">PendakiSantuy</p>
                <p className="text-xs text-stone-400">Est. 2023</p>
              </div>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Tempat sewa alat daki & camping terpercaya. Alat berkualitas, harga terjangkau, respon cepat.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 bg-forest-700 hover:bg-forest-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-forest-700 hover:bg-forest-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Informasi</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-stone-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-forest-400" />
                <span>Jl. Raya Pendaki No. 23, Soreang, Bandung, Jawa Barat</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Phone className="w-4 h-4 flex-shrink-0 text-forest-400" />
                <a href={`https://wa.me/${wa}`} className="hover:text-white transition-colors">
                  +62 812-3456-7890
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-stone-400">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-forest-400" />
                <div>
                  <p>Senin – Jumat: 08.00 – 21.00</p>
                  <p>Sabtu – Minggu: 07.00 – 22.00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Menu</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalog" className="text-stone-400 hover:text-white transition-colors">Katalog Alat</Link></li>
              <li><Link href="/contact" className="text-stone-400 hover:text-white transition-colors">Kontak & Lokasi</Link></li>
              <li>
                <a href={`https://wa.me/${wa}`} className="text-stone-400 hover:text-white transition-colors">
                  Chat WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-forest-800 mt-8 pt-6 text-center text-xs text-stone-500">
          © 2026 PendakiSantuy. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  );
}
