// src/app/contact/page.tsx
import { MapPin, Phone, Clock, MessageCircle, Instagram } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWA from "@/components/layout/FloatingWA";

export default function ContactPage() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281234567890";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">Kontak & Lokasi</h1>
          <p className="text-stone-500">Temukan kami atau hubungi admin langsung</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Info */}
          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-forest-600" /> Hubungi Kami
              </h2>
              <div className="space-y-3">
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800 text-sm">WhatsApp</p>
                    <p className="text-green-600 text-xs">+62 812-3456-7890</p>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-pink-600" />
                  <div>
                    <p className="font-medium text-pink-800 text-sm">Instagram</p>
                    <p className="text-pink-600 text-xs">@pendakisantuy</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="card p-5">
              <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-forest-600" /> Alamat
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                Jl. Raya Pendaki No. 23<br />
                Soreang, Kabupaten Bandung<br />
                Jawa Barat, 40912
              </p>
            </div>

            <div className="card p-5">
              <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-forest-600" /> Jam Operasional
              </h2>
              <div className="space-y-2 text-sm">
                {[
                  { day: "Senin – Jumat", time: "08.00 – 21.00 WIB" },
                  { day: "Sabtu", time: "07.00 – 22.00 WIB" },
                  { day: "Minggu", time: "07.00 – 22.00 WIB" },
                ].map((h) => (
                  <div key={h.day} className="flex justify-between">
                    <span className="text-stone-600">{h.day}</span>
                    <span className="font-medium text-stone-800">{h.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-2 bg-green-50 rounded-lg text-xs text-green-700 text-center font-medium">
                ✅ Admin siap membalas dalam &lt; 1 menit
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="card overflow-hidden">
            <div className="h-64 md:h-full min-h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.8627!2d107.5196!3d-7.0196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDEnMTAuNiJTIDEwN8KwMzEnMTAuNiJF!5e0!3m2!1sid!2sid!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "300px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a
            href={`https://wa.me/${wa}?text=${encodeURIComponent("Halo Admin PendakiSantuy, saya ingin bertanya...")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl transition-all active:scale-95 shadow-md hover:shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            Chat Admin Sekarang
          </a>
        </div>
      </div>

      <Footer />
      <FloatingWA />
    </div>
  );
}
