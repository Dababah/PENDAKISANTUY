"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  Compass,
  ArrowUpRight,
  Flame,
  CheckCircle2,
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

// Data Kategori Diperkaya dengan Asset Gambar Nyata & Tagline
const PREMIUM_CATEGORIES = [
  {
    name: "Tenda",
    desc: "Dome 2-4 orang, waterproof & double layer",
    tag: "Ultralight",
    bgGradient: "from-emerald-500/10 to-forest-600/10",
    image: "/images/tent-cat.jpg", // Kamu bisa ganti asset gambarnya nanti
    accent: "bg-emerald-500",
  },
  {
    name: "Carrier",
    desc: "40L & 60L, ergonomis & berbagai merek",
    tag: "Ergonomic",
    bgGradient: "from-amber-500/10 to-earth-600/10",
    image: "/images/carrier-cat.jpg",
    accent: "bg-amber-500",
  },
  {
    name: "Sleeping Bag",
    desc: "Hangat hingga -5°C, tebal & nyaman",
    tag: "Thermal Tech",
    bgGradient: "from-sky-500/10 to-blue-600/10",
    image: "/images/sb-cat.jpg",
    accent: "bg-sky-500",
  },
];

export default function HomePage() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281234567890";

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-800 antialiased overflow-x-hidden">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-forest-900 via-forest-850 to-stone-900 text-white overflow-hidden py-20 lg:py-0">
        {/* Ambient Glow Background Effect */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-forest-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-earth-500/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Subtle Topographical Pattern Texture */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 16c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm20 30c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-6xl mx-auto px-4 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-stone-200 text-xs tracking-wide shadow-inner animate-fade-in">
              <Compass className="w-4 h-4 text-earth-400 animate-spin-slow" />
              <span className="font-medium">
                Basecamp Logistik Outdoor Premium Jogja
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
              Eksplorasi Alam <br />
              <span className="bg-gradient-to-r from-earth-300 via-amber-200 to-emerald-300 bg-clip-text text-transparent">
                Tanpa Beban Logistik
              </span>
            </h1>

            <p className="text-forest-100/80 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Sewa perlengkapan daki gunung grade-ekspedisi dengan standardisasi
              sterilisasi ketat. Praktis, real-time stok, dan siap pakai untuk
              petualangan hebatmu berikutnya.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link
                href="/catalog"
                className="group bg-earth-500 hover:bg-earth-600 text-white font-semibold px-8 py-4 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-earth-900/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
                Mulai Sewa Alat
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={`https://wa.me/${wa}?text=${encodeURIComponent("Halo Admin PendakiSantuy...")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 border border-white/10 hover:border-white/30 text-white font-medium px-6 py-4 rounded-xl inline-flex items-center gap-2 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                Konsultasi Rencana Daki
              </a>
            </div>
          </div>

          {/* Right Showcase Hero Box (Premium Aesthetic Frame) */}
          <div className="lg:col-span-5 flex justify-center w-full animate-fade-in-up">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 aspect-square rounded-3xl p-3 bg-gradient-to-br from-white/10 to-white/0 border border-white/10 backdrop-blur-sm shadow-2xl group">
              <div className="absolute inset-0 bg-forest-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="w-full h-full rounded-2xl overflow-hidden bg-forest-950 relative flex items-center justify-center border border-white/5">
                <Image
                  src="/images/logo.png"
                  alt="Logo PendakiSantuy"
                  fill
                  className="object-contain p-8 transform group-hover:scale-105 duration-700 ease-out"
                  priority
                />
                {/* Floating Micro Badge */}
                <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 text-[11px] font-medium tracking-wide">
                  <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                  <span>Ready for 2026 Season</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Divider Curved Line */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none transform translate-y-[1px]">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full h-auto">
            <path
              d="M0 40L1440 40L1440 0C1050 28 650 28 0 0L0 40Z"
              fill="#FAF9F5"
            />
          </svg>
        </div>
      </section>

      {/* ================= BENTO GRID FEATURE SECTION ================= */}
      <section className="py-24 max-w-6xl mx-auto px-4 w-full">
        <div className="text-center md:text-left max-w-xl mb-16 space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-forest-600 font-bold text-xs tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-earth-500" /> Mengapa
            PendakiSantuy
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
            Standardisasi Manajemen Sewa Modern & Andal
          </h2>
        </div>

        {/* Bento Grid Layout Integration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Steril Feature (Large Card) */}
          <div className="md:col-span-2 bg-white border border-stone-200/60 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-forest-50 rounded-full group-hover:scale-110 transition-transform duration-500 -z-0 opacity-60" />
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-forest-50 border border-forest-100 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-forest-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-stone-900">
                  Alat Steril & Siap Pakai
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed max-w-md">
                  Seluruh perlengkapan wajib melalui proses laundry desinfektan
                  kimiawi serta inspeksi fungsi mekanikal kelayakan secara ketat
                  sebelum diserahterimakan ke penyewa.
                </p>
              </div>
            </div>
            <div className="pt-6 relative z-10 flex items-center gap-2 text-xs font-semibold text-forest-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Garansi
              Higienis 100%
            </div>
          </div>

          {/* Card 2: Smart Inventory System */}
          <div className="bg-white border border-stone-200/60 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-stone-900">
                  Live Stock Checking
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Cek sisa kuantitas alat secara real-time berdasarkan integrasi
                  kalender tanggal keberangkatanmu.
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-stone-400 group-hover:text-amber-600 transition-colors pt-4 flex items-center gap-1">
              Automated Pipeline Track <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 3: Price Package */}
          <div className="bg-white border border-stone-200/60 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-center">
                <Star className="w-6 h-6 text-sky-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-stone-900">
                  Paket Hemat Mahasiswa
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Skema regulasi tarif transparan tanpa biaya siluman
                  tersembunyi. Ramah di kantong mahasiswa.
                </p>
              </div>
            </div>
            <div className="text-lg font-black text-stone-950 pt-4">
              <span className="text-xs font-normal text-stone-400 block">
                Tarif Mulai Dari
              </span>
              Rp 10.000
              <span className="text-xs font-normal text-stone-500">
                {" "}
                / hari
              </span>
            </div>
          </div>

          {/* Card 4: Basecamp Location Extra Card (Fills space nicely) */}
          <div className="md:col-span-2 bg-gradient-to-r from-stone-900 to-stone-850 text-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="bg-white/10 px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider w-max text-earth-300">
                Lokasi Strategis
              </div>
              <h3 className="font-display font-bold text-lg">
                Butuh Ambil Barang Langsung Ke Basecamp?
              </h3>
              <p className="text-stone-400 text-xs max-w-md">
                Terletak strategis dekat area kampus UMY, Kasihan, Bantul. Buka
                setiap hari untuk mempermudah pengecekan fisik produk.
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-white text-stone-900 px-5 py-3 rounded-xl text-xs font-bold hover:bg-stone-100 transition-colors flex items-center gap-1.5 shrink-0">
              Lihat Google Maps <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= VISUAL CATEGORIES SECTION ================= */}
      <section className="py-20 bg-[#F4F2EB]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-md mx-auto mb-16 space-y-2">
            <h2 className="font-display text-3xl font-black text-stone-900 tracking-tight">
              Kategori Terfavorit
            </h2>
            <p className="text-stone-500 text-sm">
              Klasifikasi perlengkapan gunung tangguh yang siap temani
              perjalanan ekspedisimu.
            </p>
          </div>

          {/* Grid Kategori Bergaya Card Katalog Premium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PREMIUM_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/catalog?category=${cat.name}`}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-stone-200/40">
                {/* Image Placeholder Frame dengan Background Gradient */}
                <div
                  className={`h-48 relative bg-gradient-to-br ${cat.bgGradient} flex items-center justify-center p-6 overflow-hidden`}>
                  {/* Efek Dummy Icon atau Gambar Kustom */}
                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-stone-700 uppercase tracking-wide">
                    {cat.tag}
                  </div>
                  {/* Placeholder Visual Indah Minimalis pengganti Icon Lucide Lama */}
                  <div className="w-20 h-20 bg-white/60 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 ease-out">
                    <span className="text-2xl">⛰️</span>
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-xl text-stone-900 group-hover:text-forest-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-stone-500 text-xs leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-forest-700 pt-2 group-hover:gap-2 transition-all">
                    Eksplor Seri Alat <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/catalog"
              className="bg-forest-600 hover:bg-forest-700 text-white font-semibold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 shadow-md transition-all duration-200 hover:-translate-y-0.5">
              Buka Seluruh Katalog Produk <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section className="py-24 max-w-6xl mx-auto px-4">
        <div className="text-center max-w-md mx-auto mb-16 space-y-2">
          <h2 className="font-display text-3xl font-black text-stone-900 tracking-tight">
            Cerita Jurnal Pendaki
          </h2>
          <p className="text-stone-500 text-sm">
            Kesan otentik petualangan aman dari para mitra penjelajah kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white border border-stone-200/50 p-8 rounded-3xl shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow">
              <div className="space-y-4">
                {/* Rating Stars Minimalis */}
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(t.rating)].map((_, index) => (
                    <Star key={index} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-stone-600 text-sm italic leading-relaxed font-light">
                  "{t.text}"
                </p>
              </div>

              <div className="border-t border-stone-100 pt-6 mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest-50 text-forest-700 font-bold flex items-center justify-center text-xs border border-forest-100 shadow-sm">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-sm">{t.name}</p>
                  <p className="text-forest-600 font-medium text-[10px] uppercase tracking-wider mt-0.5">
                    {t.trip}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FINAL CALL TO ACTION ================= */}
      <section className="py-24 bg-stone-950 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-forest-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 text-center space-y-8 relative z-10">
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-inner animate-bounce">
            🎒
          </div>
          <div className="space-y-3">
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight">
              Agenda Pendakian Sudah Dekat?
            </h2>
            <p className="text-stone-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light">
              Jangan biarkan keterbatasan anggaran alat mematikan impian
              petualanganmu. Amankan kuota stok sewa alat camping-mu dari
              sekarang sebelum kehabisan slot musim pendakian!
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/catalog"
              className="bg-earth-500 hover:bg-earth-600 text-white font-semibold px-8 py-4 rounded-xl inline-flex items-center gap-2 shadow-xl shadow-earth-950/50 transition-all duration-200 hover:-translate-y-0.5">
              Booking Alat Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="bg-white/5 border border-white/10 hover:border-white/20 text-stone-200 font-medium px-6 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm">
              Hubungi Lokasi Basecamp
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWA />
    </div>
  );
}
