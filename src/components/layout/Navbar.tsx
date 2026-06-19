"use client";
// src/components/layout/Navbar.tsx
import Link from "next/link";
import { useState } from "react";
import { Mountain, Menu, X, ShoppingCart, Home } from "lucide-react"; // Ditambahkan ikon Home
import { useCart } from "@/hooks/useCart";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <nav className="bg-white border-b border-stone-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-forest-600 rounded-xl flex items-center justify-center">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-forest-700 text-lg leading-none">
                PendakiSantuy
              </span>
              <p className="text-xs text-stone-500 leading-none">
                Sewa Alat Daki & Camping
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {/* Tombol Beranda Baru */}
            <Link
              href="/"
              className="text-stone-600 hover:text-forest-600 font-medium transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" /> Beranda
            </Link>
            <Link
              href="/catalog"
              className="text-stone-600 hover:text-forest-600 font-medium transition-colors">
              Katalog
            </Link>
            <Link
              href="/contact"
              className="text-stone-600 hover:text-forest-600 font-medium transition-colors">
              Kontak
            </Link>
            <Link
              href="/catalog"
              className="relative flex items-center gap-2 btn-primary text-sm py-2 px-4">
              <ShoppingCart className="w-4 h-4" />
              Keranjang
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-earth-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/catalog" className="relative">
              <ShoppingCart className="w-6 h-6 text-forest-600" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-earth-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setOpen(!open)}>
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden py-4 border-t border-stone-100 flex flex-col gap-3">
            {/* Tombol Beranda Baru untuk Mobile */}
            <Link
              href="/"
              className="text-stone-700 font-medium py-2 flex items-center gap-2"
              onClick={() => setOpen(false)}>
              <Home className="w-5 h-5 text-stone-500" /> Beranda
            </Link>
            <Link
              href="/catalog"
              className="text-stone-700 font-medium py-2"
              onClick={() => setOpen(false)}>
              Katalog Alat
            </Link>
            <Link
              href="/contact"
              className="text-stone-700 font-medium py-2"
              onClick={() => setOpen(false)}>
              Kontak & Lokasi
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
