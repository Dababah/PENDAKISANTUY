// src/app/page.tsx
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  Star,
  ArrowRight,
  Package,
  Tent,
  Backpack,
  Compass,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWA from "@/components/layout/FloatingWA";

const TESTIMONIALS = [
  {
    name: "Reza Firmansyah",
    rating: 5,
    text: "Alat lengkap dan bersih! Tenda yang saya sewa kondisinya bagus banget. Adminnya juga responsif banget, bales chat cepet.",
    trip: "Pendakian Papandayan",
  },
  {
    name: "Siti Rahayu",
    rating: 5,
    text: "Pertama kali daki dan ga punya alat sama sekali. Sewa di sini murah, prosesnya gampang tinggal chat WA. Recommended!",
    trip: "Pendakian Gunung Gede",
  },
  {
    name: "Budi Santoso",
    rating: 5,
    text: "Sudah langganan 3x sewa di sini. Harga konsisten, alat terawat, dan ga pernah ada masalah. Pokoknya top!",
    trip: "Pendakian Rinjani",
  },
];

const CATEGORIES = [
  {
    name: "Tenda",
    icon: Tent,
    desc: "Dome 2-4 orang, waterproof & double layer",
  },
  {
    name: "Carrier",
    icon: Backpack,
    desc: "40L & 60L, ergonomis & berbagai merek",
  },
  {
    name: "Sleeping Bag",
    icon: Package,
    desc: "Hangat hingga -5°C, tebal & nyaman",
  },
];

export default function HomePage() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281234567890";

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf2]">
      {" "}
      {/* Menggunakan warna off-white bertema alam */}
      <Navbar />
      {/* Hero Section — Pembaruan Split Layout Dua Kolom */}
      <section className="relative bg-forest-800 text-white overflow-hidden py-16 md:py-24 lg:py-28">
        {/* Pola Background Grid Halus */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Kolom Kiri: Pesan Utama */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-forest-700/60 backdrop-blur-sm border border-forest-600 px-4 py-2 rounded-full text-forest-200 text-sm shadow-sm">
                <Compass className="w-4 h-4 text-earth-400 animate-spin-slow" />
                <span>Basecamp Sewa Alat Outdoor Terpercaya di Jogja</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Daki Santuy, <br />
                <span className="text-earth-400 relative inline-block">
                  Tanpa Beban Beli Alat
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-earth-500/20 rounded -z-10" />
                </span>
              </h1>

              <p className="text-forest-200 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Sewa alat pendakian premium dengan standardisasi kebersihan
                ketat. Tenda dome, carrier tangguh, hingga sleeping bag hangat —
                semua siap pakai. Transaksi cerdas via website langsung ke
                WhatsApp!
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/catalog"
                  className="bg-earth-500 hover:bg-earth-600 text-white font-semibold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-earth-900/20 transform active:scale-95 transition-all duration-150">
                  Jelajahi Katalog{" "}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={`https://wa.me/${wa}?text=${encodeURIComponent("Halo Admin PendakiSantuy, saya mau tanya-tanya ketersediaan alat outdoor...")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-transparent border border-white/40 hover:border-white text-white font-medium px-6 py-3.5 rounded-xl inline-flex items-center gap-2 hover:bg-white/5 transform active:scale-95 transition-all duration-150">
                  Konsultasi Rencana Daki
                </a>
              </div>
            </div>

            {/* Kolom Kanan: Showcase Logo Utama Berwujud Maket Premium */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group p-4">
                {/* Efek Cahaya Latar Belakang Lingkaran */}
                <div className="absolute inset-0 bg-gradient-to-tr from-earth-500 to-forest-500 rounded-full blur-2xl opacity-30 group-hover:opacity-40 transition-opacity duration-500" />

                {/* Bingkai Lingkaran Logo Dengan Efek Hover */}
                <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full border-4 border-white/20 bg-stone-900/10 backdrop-blur-sm p-2 shadow-2xl overflow-hidden transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                  <img
                    src="/images/logo.png" // Tempatkan berkas logo kamu di folder public/images/logo.jpg
                    alt="Logo PendakiSantuy"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      // Cadangan visual jika gambar belum dimasukkan ke folder public
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kurva Gelombang Pembatas Bawah Yang Mulus */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto">
            <path
              d="M0 40L1440 40L1440 0C1100 30 740 30 0 0L0 40Z"
              fill="#fcfaf2"
            />
          </svg>
        </div>
      </section>
      {/* Keunggulan Layanan — Ditambahkan Efek Hover Interaktif */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Alat Steril & Siap Pakai",
                desc: "Seluruh perlengkapan wajib melalui proses cuci desinfektan dan inspeksi fungsi kelayakan ketat sebelum diserahkan.",
              },
              {
                icon: Clock,
                title: "Sistem Manajemen Stok Pintar",
                desc: "Cek langsung sisa kuantitas barang secara real-time berdasarkan tanggal pendakian pilihanmu tanpa tebak-tebakan.",
              },
              {
                icon: Star,
                title: "Paket Sewa Hemat Mahasiswa",
                desc: "Skema tarif transparan mulai dari Rp 10.000/hari. Pilihan terbaik untuk menekan budget petualanganmu.",
              },
            ].map((f, index) => (
              <div
                key={index}
                className="bg-white border border-stone-200/60 p-6 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="w-12 h-12 bg-forest-50 border border-forest-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-6 h-6 text-forest-600" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 text-lg mb-1">
                    {f.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Kategori Utama — Ditambahkan Transform Skala Mikro & Transisi Aksen */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-extrabold text-stone-800 mb-2">
              Kategori Perlengkapan Terfavorit
            </h2>
            <p className="text-stone-500 max-w-md mx-auto">
              Pilih klasifikasi alat pendakian yang ingin kamu jadwalkan
              penyewaan ketersediaannya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/catalog?category=${cat.name}`}
                className="bg-white border border-stone-200/60 p-8 text-center rounded-2xl shadow-sm hover:shadow-xl hover:border-forest-300 transition-all duration-300 group cursor-pointer flex flex-col justify-between items-center">
                <div className="w-16 h-16 bg-stone-50 border border-stone-100 group-hover:bg-forest-600 group-hover:border-forest-600 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 shadow-inner">
                  <cat.icon className="w-7 h-7 text-forest-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-stone-800 mb-1 group-hover:text-forest-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-stone-500 text-sm px-2">{cat.desc}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-forest-600 group-hover:text-forest-700 text-sm font-semibold mt-5 group-hover:gap-2 transition-all">
                  Eksplor Alat <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/catalog"
              className="bg-forest-600 hover:bg-forest-700 text-white font-semibold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 transform active:scale-95 transition-all shadow-md shadow-forest-900/10">
              Buka Seluruh Katalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      {/* Testimonials — Menggunakan Desain Grid Asimetris Modis */}
      <section className="py-20 bg-gradient-to-b from-stone-50 to-forest-50/40 border-t border-b border-stone-200/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-extrabold text-stone-800 mb-2">
              Cerita Dari Para Pendaki
            </h2>
            <p className="text-stone-500">
              Kesan nyata perjalanan dari ratusan mitra petualang kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white border border-stone-200/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4 bg-stone-50 w-max px-2.5 py-1 rounded-full border border-stone-100">
                    {[...Array(t.rating)].map((_, index) => (
                      <Star
                        key={index}
                        className="w-3.5 h-3.5 fill-earth-400 text-earth-400"
                      />
                    ))}
                  </div>
                  <p className="text-stone-600 text-sm italic leading-relaxed mb-6">
                    "{t.text}"
                  </p>
                </div>
                <div className="border-t border-stone-100 pt-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-forest-100 text-forest-700 font-bold flex items-center justify-center text-xs">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-bold text-stone-800 text-sm">{t.name}</p>
                    <p className="text-forest-600 font-medium text-[11px] bg-forest-50 border border-forest-100/40 px-1.5 py-0.5 rounded-md mt-0.5 w-max">
                      {t.trip}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Bagian Call to Action Akhir */}
      <section className="py-20 bg-white relative">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <div className="text-4xl">🎒</div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-stone-800">
            Agenda Pendakian Sudah Dekat?
          </h2>
          <p className="text-stone-500 max-w-xl mx-auto leading-relaxed">
            Jangan biarkan budget pembelian peralatan membatalkan rencana
            ekspedisimu. Amankan kuota ketersediaan alat camping kamu secara
            praktis melalui portal logistik outdoor kami.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/catalog"
              className="bg-earth-500 hover:bg-earth-600 text-white font-semibold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-earth-500/10 transform active:scale-95 transition-all">
              Mulai Pilih Alat <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-700 font-medium px-6 py-3.5 rounded-xl transform active:scale-95 transition-all">
              Lihat Alamat Basecamp
            </Link>
          </div>
        </div>
      </section>
      <Footer />
      <FloatingWA />
    </div>
  );
}
