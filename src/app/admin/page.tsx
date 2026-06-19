"use client";
// src/app/admin/page.tsx
import { useState, useEffect } from "react";
import { BookOpen, Package, TrendingUp, AlertCircle, Clock, Copy, CheckCircle } from "lucide-react";
import { ManualBooking } from "@/types";
import { formatCurrency, formatDateShort, getStatusColor, getStatusLabel } from "@/lib/utils";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<ManualBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  }

  const stats = {
    total: bookings.length,
    active: bookings.filter((b) => b.status === "ACTIVE").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    revenue: bookings
      .filter((b) => b.status !== "CANCELLED")
      .reduce((s, b) => s + b.totalPrice, 0),
  };

  // D-Day: bookings ending today or tomorrow
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dDayBookings = bookings.filter((b) => {
    const end = new Date(b.endDate);
    end.setHours(0, 0, 0, 0);
    return (
      (b.status === "ACTIVE" || b.status === "CONFIRMED") &&
      (end.getTime() === today.getTime() || end.getTime() === tomorrow.getTime())
    );
  });

  function copyConfirmation(b: ManualBooking) {
    const text = `✅ Booking Confirmed!\n\nBooking Code: ${b.bookingCode}\nNama: ${b.customerName}\nPeriode: ${formatDateShort(b.startDate)} → ${formatDateShort(b.endDate)}\nTotal: ${formatCurrency(b.totalPrice)}\nDeposit: ${formatCurrency(b.depositAmount)}\n\nTerima kasih sudah booking di PendakiSantuy! 🏔️`;
    navigator.clipboard.writeText(text);
    setCopied(b.id);
    setTimeout(() => setCopied(null), 2000);
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchBookings();
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-stone-800">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Booking", value: stats.total, icon: BookOpen, color: "text-blue-600 bg-blue-50" },
          { label: "Aktif", value: stats.active, icon: Package, color: "text-green-600 bg-green-50" },
          { label: "Menunggu", value: stats.confirmed, icon: Clock, color: "text-yellow-600 bg-yellow-50" },
          { label: "Total Pendapatan", value: formatCurrency(stats.revenue), icon: TrendingUp, color: "text-forest-600 bg-forest-50" },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-stone-800">{s.value}</p>
            <p className="text-stone-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* D-Day Alert */}
      {dDayBookings.length > 0 && (
        <div className="card border-orange-200 bg-orange-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h2 className="font-semibold text-orange-800">⚠️ Pengembalian Hari Ini / Besok ({dDayBookings.length})</h2>
          </div>
          <div className="space-y-2">
            {dDayBookings.map((b) => (
              <div key={b.id} className="bg-white rounded-xl p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm text-stone-800">{b.customerName} — {b.bookingCode}</p>
                  <p className="text-xs text-stone-500">Kembali: {formatDateShort(b.endDate)} · {b.items.length} jenis alat</p>
                </div>
                <span className={`badge ${getStatusColor(b.status)}`}>{getStatusLabel(b.status)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Bookings */}
      <div>
        <h2 className="font-display text-lg font-bold text-stone-800 mb-3">Booking Terbaru</h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card h-20 animate-pulse bg-stone-100" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 10).map((b) => (
              <div key={b.id} className="card p-4">
                <div className="flex flex-wrap items-start gap-3 justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-stone-800">{b.bookingCode}</span>
                      <span className={`badge ${getStatusColor(b.status)}`}>{getStatusLabel(b.status)}</span>
                    </div>
                    <p className="text-sm text-stone-700">{b.customerName} · {b.customerPhone}</p>
                    <p className="text-xs text-stone-400">{formatDateShort(b.startDate)} → {formatDateShort(b.endDate)} · {b.items.length} alat</p>
                    <p className="text-sm font-semibold text-forest-700 mt-1">{formatCurrency(b.totalPrice)} <span className="text-xs text-stone-400 font-normal">(deposit {formatCurrency(b.depositAmount)})</span></p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => copyConfirmation(b)} className="flex items-center gap-1 text-xs bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-lg transition-colors font-medium">
                      {copied === b.id ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied === b.id ? "Tersalin!" : "Salin"}
                    </button>
                    {b.status === "CONFIRMED" && (
                      <button onClick={() => updateStatus(b.id, "ACTIVE")} className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg font-medium transition-colors">
                        Aktifkan
                      </button>
                    )}
                    {b.status === "ACTIVE" && (
                      <button onClick={() => updateStatus(b.id, "COMPLETED")} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg font-medium transition-colors">
                        Selesai
                      </button>
                    )}
                    {(b.status === "CONFIRMED" || b.status === "ACTIVE") && (
                      <button onClick={() => updateStatus(b.id, "CANCELLED")} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg font-medium transition-colors">
                        Batalkan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
