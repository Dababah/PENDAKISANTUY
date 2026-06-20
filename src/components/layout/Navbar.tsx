"use client";

import Link from "next/link";
import Image from "next/image"; // Impor komponen Image Next.js
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, Home, Phone, Layers } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  // Helper untuk mengecek rute aktif agar styling menu dinamis
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-stone-100 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ================= LOGO BRAND ================= */}
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform active:scale-95">
            {/* Wadah Logo dengan Efek Hover */}
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-forest-600/10 group-hover:rotate-6 transition-transform duration-300 flex items-center justify-center bg-forest-700">
              <Image
                src="/images/logo.png" // Sesuaikan nama file di folder public/images/ kamu
                alt="Logo PendakiSantuy"
                width={40}
                height={40}
                className="object-cover"
                priority // Mempercepat loading aset kritis navbar
              />
            </div>
            <div>
              <span className="font-display font-bold text-forest-700 text-lg leading-none block tracking-wide group-hover:text-forest-600 transition-colors">
                Pendaki<span className="text-earth-600">Santuy</span>
              </span>
              <p className="text-[10px] sm:text-xs text-stone-500 leading-none mt-0.5 font-medium">
                Sewa Alat Daki & Camping
              </p>
            </div>
          </Link>

          {/* ================= DESKTOP NAVIGATION ================= */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`relative font-medium text-sm py-2 transition-colors flex items-center gap-1.5 ${
                isActive("/")
                  ? "text-forest-600"
                  : "text-stone-600 hover:text-forest-600"
              }`}>
              <Home className="w-4 h-4" />
              <span>Beranda</span>
              {isActive("/") && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-forest-600 rounded-full" />
              )}
            </Link>

            <Link
              href="/catalog"
              className={`relative font-medium text-sm py-2 transition-colors flex items-center gap-1.5 ${
                isActive("/catalog")
                  ? "text-forest-600"
                  : "text-stone-600 hover:text-forest-600"
              }`}>
              <Layers className="w-4 h-4" />
              <span>Katalog</span>
              {isActive("/catalog") && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-forest-600 rounded-full" />
              )}
            </Link>

            <Link
              href="/contact"
              className={`relative font-medium text-sm py-2 transition-colors flex items-center gap-1.5 ${
                isActive("/contact")
                  ? "text-forest-600"
                  : "text-stone-600 hover:text-forest-600"
              }`}>
              <Phone className="w-4 h-4" />
              <span>Kontak</span>
              {isActive("/contact") && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-forest-600 rounded-full" />
              )}
            </Link>

            {/* Tombol Keranjang Belanja */}
            <Link
              href="/catalog"
              className="relative flex items-center gap-2 btn-primary text-sm py-2 px-5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl shadow-md shadow-forest-600/10 hover:shadow-lg hover:shadow-forest-600/20 active:scale-95 transition-all duration-200 font-semibold">
              <ShoppingCart className="w-4 h-4" />
              <span>Keranjang</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-earth-500 text-white text-[10px] rounded-full min-w-5 h-5 px-1 flex items-center justify-center font-bold animate-bounce shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* ================= MOBILE CONTROLS ================= */}
          <div className="flex md:hidden items-center gap-4">
            <Link
              href="/catalog"
              className="relative p-1.5 hover:bg-stone-50 rounded-lg active:scale-95 transition-transform">
              <ShoppingCart className="w-6 h-6 text-forest-600" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-earth-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="p-1.5 text-stone-600 hover:text-forest-600 hover:bg-stone-50 rounded-lg transition-colors"
              aria-label="Toggle Menu">
              {open ? (
                <X className="w-6 h-6 animate-in fade-in zoom-in duration-200" />
              ) : (
                <Menu className="w-6 h-6 animate-in fade-in zoom-in duration-200" />
              )}
            </button>
          </div>
        </div>

        {/* ================= MOBILE DROPDOWN MENU ================= */}
        {open && (
          <div className="md:hidden py-4 border-t border-stone-100 flex flex-col gap-1.5 animate-in slide-in-from-top-4 duration-200 ease-out">
            <Link
              href="/"
              className={`flex items-center gap-3 font-medium py-3 px-4 rounded-xl transition-all ${
                isActive("/")
                  ? "bg-forest-50 text-forest-700"
                  : "text-stone-700 hover:bg-stone-50"
              }`}
              onClick={() => setOpen(false)}>
              <Home
                className={`w-5 h-5 ${isActive("/") ? "text-forest-600" : "text-stone-400"}`}
              />
              <span>Beranda</span>
            </Link>

            <Link
              href="/catalog"
              className={`flex items-center gap-3 font-medium py-3 px-4 rounded-xl transition-all ${
                isActive("/catalog")
                  ? "bg-forest-50 text-forest-700"
                  : "text-stone-700 hover:bg-stone-50"
              }`}
              onClick={() => setOpen(false)}>
              <Layers
                className={`w-5 h-5 ${isActive("/catalog") ? "text-forest-600" : "text-stone-400"}`}
              />
              <span>Katalog Alat</span>
            </Link>

            <Link
              href="/contact"
              className={`flex items-center gap-3 font-medium py-3 px-4 rounded-xl transition-all ${
                isActive("/contact")
                  ? "bg-forest-50 text-forest-700"
                  : "text-stone-700 hover:bg-stone-50"
              }`}
              onClick={() => setOpen(false)}>
              <Phone
                className={`w-5 h-5 ${isActive("/contact") ? "text-forest-600" : "text-stone-400"}`}
              />
              <span>Kontak & Lokasi</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
