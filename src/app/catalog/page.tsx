"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Send,
  X,
  Calendar,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWA from "@/components/layout/FloatingWA";
import { useCart } from "@/hooks/useCart";
import { Equipment } from "@/types";
import {
  formatCurrency,
  calculateDays,
  buildWhatsAppMessage,
} from "@/lib/utils";

const CATEGORIES = [
  "Semua",
  "Tenda",
  "Carrier",
  "Sleeping Bag",
  "Matras",
  "Masak",
  "Aksesoris",
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") ?? "Semua",
  );
  const [onlyAvailable, setOnlyAvailable] = useState(false); // Filter ketersediaan
  const [showCart, setShowCart] = useState(false);
  const [customerName, setCustomerName] = useState("");

  const {
    items,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    addItem,
    removeItem,
    updateQty,
    totalItems,
    totalPrice,
  } = useCart();

  useEffect(() => {
    fetchEquipment();
  }, [category, search]);

  async function fetchEquipment() {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "Semua") params.set("category", category);
    if (search) params.set("search", search);
    try {
      const res = await fetch(`/api/equipment?${params.toString()}`);
      const data = await res.json();
      setEquipment(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const days = startDate && endDate ? calculateDays(startDate, endDate) : 1;

  // Fungsi Inti: Menghitung sisa ketersediaan barang pada rentang tanggal terpilih
  const getAvailableStock = (eq: Equipment) => {
    if (!startDate || !endDate) {
      // Jika tanggal belum dipilih, cek bentrokan dengan hari ini saja
      const todayStr = new Date().toISOString().split("T")[0];
      const itemsRentedToday =
        eq.activeBookings
          ?.filter((b: any) => todayStr >= b.startDate && todayStr <= b.endDate)
          ?.reduce((acc: number, b: any) => acc + b.quantity, 0) || 0;
      return Math.max(0, eq.totalStock - itemsRentedToday);
    }

    // Jika user sudah memilih tanggal sewa, hitung konflik puncak tertinggi dalam rentang tersebut
    let maxRentedInPeriod = 0;
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const currentStr = d.toISOString().split("T")[0];
      const rentedOnThisDay =
        eq.activeBookings
          ?.filter(
            (b: any) => currentStr >= b.startDate && currentStr <= b.endDate,
          )
          ?.reduce((acc: number, b: any) => acc + b.quantity, 0) || 0;

      if (rentedOnThisDay > maxRentedInPeriod) {
        maxRentedInPeriod = rentedOnThisDay;
      }
    }

    return Math.max(0, eq.totalStock - maxRentedInPeriod);
  };

  // Fungsi mencari tanggal terdekat kapan barang kembali tersedia utuh
  const getNextAvailableDate = (eq: Equipment) => {
    if (!eq.activeBookings || eq.activeBookings.length === 0) return null;
    const dates = eq.activeBookings.map((b: any) =>
      new Date(b.endDate).getTime(),
    );
    const maxDate = new Date(Math.max(...dates));
    return maxDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  // Filter list perlengkapan berdasarkan kategori + toggle ketersediaan barang
  const filteredEquipment = equipment.filter((eq) => {
    if (onlyAvailable) {
      return getAvailableStock(eq) > 0;
    }
    return true;
  });

  function sendWhatsApp() {
    if (!customerName.trim()) {
      alert("Masukkan nama kamu dulu!");
      return;
    }
    if (!startDate || !endDate) {
      alert("Pilih tanggal sewa dulu!");
      return;
    }
    if (items.length === 0) {
      alert("Keranjang kosong!");
      return;
    }

    // Validasi ulang kuantitas keranjang vs sisa stok terbaru sebelum checkout
    for (const item of items) {
      const liveStock = getAvailableStock(item.equipment);
      if (item.quantity > liveStock) {
        alert(
          `Maaf, stok untuk ${item.equipment.name} tidak mencukupi untuk rentang tanggal tersebut. Sisa tersedia: ${liveStock}`,
        );
        return;
      }
    }

    const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281234567890";
    const msg = buildWhatsAppMessage(
      items.map((i) => ({
        name: i.equipment.name,
        quantity: i.quantity,
        id: i.equipment.id,
      })),
      startDate,
      endDate,
      customerName,
    );
    window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">
              Katalog Alat Sewa
            </h1>
            <p className="text-stone-500">
              Sistem pintar terintegrasi cek ketersediaan otomatis
            </p>
          </div>

          {/* Toggle Filter Tersedia Saja */}
          <label className="inline-flex items-center gap-2 bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl cursor-pointer hover:bg-stone-100 transition-colors select-none">
            <input
              type="checkbox"
              className="rounded text-forest-600 focus:ring-forest-500 w-4 h-4"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            <span className="text-sm font-medium text-stone-700">
              Hanya tampilkan alat yang ready
            </span>
          </label>
        </div>

        {/* Search & Filter Kategori */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              className="input pl-10"
              placeholder="Cari alat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  category === c
                    ? "bg-forest-600 text-white"
                    : "bg-white border border-stone-200 text-stone-600 hover:border-forest-300"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Date Picker */}
        <div className="card p-4 mb-6 bg-forest-50 border-forest-100">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-forest-600" />
            <span className="font-medium text-stone-700 text-sm">
              Pilih Tanggal Sewa (Cek Stok Otomatis)
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="label">Tanggal Mulai</label>
              <input
                type="date"
                className="input"
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="label">Tanggal Selesai</label>
              <input
                type="date"
                className="input"
                value={endDate}
                min={startDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {startDate && endDate && (
              <div className="flex items-end">
                <div className="bg-forest-600 text-white px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap">
                  {days} Hari
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grid Katalog Alat */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card h-64 animate-pulse bg-stone-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredEquipment.map((eq) => {
              const inCart = items.find((i) => i.equipment.id === eq.id);
              const availableStock = getAvailableStock(eq);
              const isOut = availableStock <= 0;
              const nextAvailable = getNextAvailableDate(eq);

              return (
                <div
                  key={eq.id}
                  className={`card hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative ${isOut ? "opacity-75" : ""}`}>
                  <div>
                    {/* Badge Indikator Ketersediaan Real-Time */}
                    <div className="absolute top-2 right-2 z-10">
                      {isOut ? (
                        <span className="flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                          <AlertTriangle className="w-3 h-3" /> Dipinjam{" "}
                          {nextAvailable ? `s/d ${nextAvailable}` : ""}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                          <CheckCircle className="w-3 h-3" /> Ready
                        </span>
                      )}
                    </div>

                    <div className="h-44 bg-forest-100 flex items-center justify-center relative">
                      {eq.imageUrl ? (
                        <img
                          src={eq.imageUrl}
                          alt={eq.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-5xl">🏕️</div>
                      )}
                    </div>

                    <div className="p-4 pb-0">
                      <div className="mb-1">
                        <span className="text-xs bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full">
                          {eq.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-stone-800 mb-1">
                        {eq.name}
                      </h3>
                      {eq.description && (
                        <p className="text-stone-500 text-xs mb-2 line-clamp-2">
                          {eq.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-forest-700">
                        {formatCurrency(eq.pricePerDay)}
                        <span className="text-xs font-normal text-stone-400">
                          /hari
                        </span>
                      </span>
                      <div className="text-right">
                        <span
                          className={`text-xs font-medium block ${isOut ? "text-red-500" : "text-stone-500"}`}>
                          Sisa Stok: {availableStock}{" "}
                          <span className="text-stone-400 text-[10px]">
                            ({eq.totalStock})
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Tombol Pembelian Dinamis */}
                    {isOut ? (
                      <button
                        disabled
                        className="w-full bg-stone-100 text-stone-400 font-medium py-2 rounded-xl text-sm border border-stone-200 cursor-not-allowed">
                        Stok Kosong di Tanggal Ini
                      </button>
                    ) : inCart ? (
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() =>
                            inCart.quantity === 1
                              ? removeItem(eq.id)
                              : updateQty(eq.id, inCart.quantity - 1)
                          }
                          className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center hover:bg-red-100 transition-colors">
                          {inCart.quantity === 1 ? (
                            <Trash2 className="w-4 h-4 text-red-500" />
                          ) : (
                            <Minus className="w-4 h-4" />
                          )}
                        </button>
                        <span className="font-bold text-stone-800">
                          {inCart.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(eq.id, inCart.quantity + 1)}
                          disabled={inCart.quantity >= availableStock}
                          className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center hover:bg-forest-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-forest-600 font-medium ml-1">
                          Ditambahkan ✓
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => addItem(eq)}
                        className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Tambah ke Keranjang
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredEquipment.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">
              Tidak ada alat pendakian yang cocok / tersedia
            </p>
          </div>
        )}
      </div>

      {/* Tampilan Cart Floating Action Button */}
      {totalItems > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-24 right-6 z-40 bg-forest-600 text-white rounded-full px-5 py-3 shadow-lg flex items-center gap-2 hover:bg-forest-700 transition-all shadow-forest-500/20">
          <ShoppingCart className="w-5 h-5" />
          <span className="font-semibold">{totalItems} alat</span>
          {startDate && endDate && (
            <span className="text-forest-200">
              · {formatCurrency(totalPrice(days))}
            </span>
          )}
        </button>
      )}

      {/* Cart Drawer / Slide Sheet */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowCart(false)}
          />
          <div className="w-full max-w-md bg-white h-full overflow-y-auto flex flex-col shadow-2xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Keranjang Sewa</h2>
              <button onClick={() => setShowCart(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {startDate && endDate && (
                <div className="bg-forest-50 border border-forest-100 rounded-xl p-3 text-sm">
                  <p className="font-medium text-forest-700">
                    📅 Jadwal Sewa: {startDate} → {endDate} ({days} hari)
                  </p>
                </div>
              )}

              {items.map((item) => {
                const liveStock = getAvailableStock(item.equipment);
                const isOverStock = item.quantity > liveStock;

                return (
                  <div
                    key={item.equipment.id}
                    className={`card p-3 flex flex-col gap-2 ${isOverStock ? "border-red-300 bg-red-50/50" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-forest-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                        🏕️
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-stone-800 truncate">
                          {item.equipment.name}
                        </p>
                        <p className="text-xs text-stone-500">
                          {formatCurrency(item.equipment.pricePerDay)}/h ×{" "}
                          {item.quantity} × {days}h ={" "}
                          <span className="text-forest-600 font-semibold">
                            {formatCurrency(
                              item.equipment.pricePerDay * item.quantity * days,
                            )}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            item.quantity === 1
                              ? removeItem(item.equipment.id)
                              : updateQty(item.equipment.id, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center">
                          {item.quantity === 1 ? (
                            <Trash2 className="w-3 h-3 text-red-500" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                        </button>
                        <span className="w-5 text-center font-bold text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQty(item.equipment.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= liveStock}
                          className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center disabled:opacity-30">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    {isOverStock && (
                      <p className="text-[11px] text-red-600 font-medium">
                        ⚠️ Melebihi batas aman! Sisa stok tanggal ini hanya{" "}
                        {liveStock} unit.
                      </p>
                    )}
                  </div>
                );
              })}

              <div className="border-t border-stone-100 pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Estimasi</span>
                  <span className="text-forest-700">
                    {formatCurrency(totalPrice(days))}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  *Nominal jaminan deposit dikonfirmasi via WA
                </p>
              </div>

              <div>
                <label className="label">Nama Penyewa *</label>
                <input
                  className="input"
                  placeholder="Ketik nama lengkap kamu..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 border-t bg-stone-50">
              <button
                onClick={sendWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-green-500/10">
                <Send className="w-5 h-5" />
                Kirim Pengajuan via WhatsApp
              </button>
              <p className="text-xs text-stone-400 text-center mt-2">
                Format otomatis akan disusun rapi untuk dikirim
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <FloatingWA />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-stone-400">
          Memuat Katalog...
        </div>
      }>
      <CatalogContent />
    </Suspense>
  );
}
