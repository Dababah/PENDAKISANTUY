"use client";
// src/app/admin/bookings/page.tsx
import { useState, useEffect } from "react";
import { Plus, Search, Copy, CheckCircle, Trash2 } from "lucide-react";
import { ManualBooking, Equipment } from "@/types";
import { formatCurrency, formatDateShort, calculateDays, getStatusColor, getStatusLabel } from "@/lib/utils";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<ManualBooking[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    startDate: "",
    endDate: "",
    depositAmount: "",
    notes: "",
    items: [{ equipmentId: "", quantity: 1 }],
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const [br, er] = await Promise.all([fetch("/api/bookings"), fetch("/api/equipment")]);
    setBookings(await br.json());
    setEquipment(await er.json());
    setLoading(false);
  }

  function calcTotal() {
    if (!form.startDate || !form.endDate) return 0;
    const days = calculateDays(form.startDate, form.endDate);
    return form.items.reduce((sum, item) => {
      const eq = equipment.find((e) => e.id === item.equipmentId);
      return sum + (eq ? eq.pricePerDay * item.quantity * days : 0);
    }, 0);
  }

  async function handleSubmit() {
    setFormError("");
    if (!form.customerName || !form.customerPhone || !form.startDate || !form.endDate) {
      setFormError("Lengkapi semua field wajib!"); return;
    }
    if (form.items.some((i) => !i.equipmentId)) {
      setFormError("Pilih alat untuk semua item!"); return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          depositAmount: Number(form.depositAmount) || 0,
          items: form.items.map((i) => ({ equipmentId: i.equipmentId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setShowForm(false);
      setForm({ customerName: "", customerPhone: "", startDate: "", endDate: "", depositAmount: "", notes: "", items: [{ equipmentId: "", quantity: 1 }] });
      fetchAll();
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  function copyConfirmation(b: ManualBooking) {
    const text = `✅ *Booking Confirmed - PendakiSantuy*\n\n📋 Kode: *${b.bookingCode}*\n👤 Nama: ${b.customerName}\n📱 HP: ${b.customerPhone}\n📅 Periode: ${formatDateShort(b.startDate)} → ${formatDateShort(b.endDate)}\n🎒 Alat:\n${b.items.map((i) => `  - ${i.quantity}x ${i.equipment.name}`).join("\n")}\n\n💰 Total: *${formatCurrency(b.totalPrice)}*\n💵 Deposit: ${formatCurrency(b.depositAmount)}\n\nTerima kasih sudah mempercayai PendakiSantuy! 🏔️\nSelamat mendaki dan jaga keselamatan ya!`;
    navigator.clipboard.writeText(text);
    setCopied(b.id);
    setTimeout(() => setCopied(null), 2000);
  }

  async function deleteBooking(id: string) {
    if (!confirm("Hapus booking ini?")) return;
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    fetchAll();
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchAll();
  }

  const filtered = bookings.filter(
    (b) =>
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.customerPhone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-stone-800">Kelola Booking</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
          <Plus className="w-4 h-4" /> Tambah Booking
        </button>
      </div>

      {/* Quick Add Form */}
      {showForm && (
        <div className="card p-5 border-forest-200 bg-forest-50">
          <h2 className="font-semibold text-stone-800 mb-4">📋 Quick Add Booking</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Nama Pelanggan *</label>
              <input className="input bg-white" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Nama lengkap..." />
            </div>
            <div>
              <label className="label">No. HP / WhatsApp *</label>
              <input className="input bg-white" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} placeholder="08xxxxxxxxxx" />
            </div>
            <div>
              <label className="label">Tanggal Mulai *</label>
              <input type="date" className="input bg-white" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <label className="label">Tanggal Selesai *</label>
              <input type="date" className="input bg-white" value={form.endDate} min={form.startDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>

          <div className="mt-4">
            <label className="label">Alat yang Disewa *</label>
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <select
                    className="input bg-white flex-1"
                    value={item.equipmentId}
                    onChange={(e) => {
                      const updated = [...form.items];
                      updated[idx].equipmentId = e.target.value;
                      setForm({ ...form, items: updated });
                    }}
                  >
                    <option value="">-- Pilih Alat --</option>
                    {equipment.map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.name} ({formatCurrency(eq.pricePerDay)}/hari) — Stok: {eq.totalStock}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    className="input bg-white w-20"
                    value={item.quantity}
                    onChange={(e) => {
                      const updated = [...form.items];
                      updated[idx].quantity = Number(e.target.value);
                      setForm({ ...form, items: updated });
                    }}
                  />
                  <button
                    onClick={() => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })}
                    className="text-red-400 hover:text-red-600 p-2"
                    disabled={form.items.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setForm({ ...form, items: [...form.items, { equipmentId: "", quantity: 1 }] })}
              className="mt-2 text-forest-600 text-sm font-medium hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Tambah alat
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="label">Deposit (Rp)</label>
              <input type="number" className="input bg-white" value={form.depositAmount} onChange={(e) => setForm({ ...form, depositAmount: e.target.value })} placeholder="0" />
            </div>
            <div>
              <label className="label">Catatan</label>
              <input className="input bg-white" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Opsional..." />
            </div>
          </div>

          {form.startDate && form.endDate && (
            <div className="mt-3 p-3 bg-white rounded-xl border border-forest-200">
              <p className="text-sm text-stone-600">
                Durasi: <strong>{calculateDays(form.startDate, form.endDate)} hari</strong> ·
                Estimasi Total: <strong className="text-forest-700">{formatCurrency(calcTotal())}</strong>
              </p>
            </div>
          )}

          {formError && <p className="text-red-600 text-sm mt-3">{formError}</p>}

          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary text-sm py-2 px-5">
              {submitting ? "Menyimpan..." : "Simpan Booking"}
            </button>
            <button onClick={() => setShowForm(false)} className="text-stone-500 hover:text-stone-700 text-sm px-4">
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input className="input pl-10" placeholder="Cari nama, kode booking, atau HP..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Booking List */}
      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="card h-24 animate-pulse bg-stone-100" />)}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <div key={b.id} className="card p-4">
              <div className="flex flex-wrap gap-3 justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-stone-800">{b.bookingCode}</span>
                    <span className={`badge ${getStatusColor(b.status)}`}>{getStatusLabel(b.status)}</span>
                  </div>
                  <p className="text-sm font-medium text-stone-700">{b.customerName} · {b.customerPhone}</p>
                  <p className="text-xs text-stone-400">{formatDateShort(b.startDate)} → {formatDateShort(b.endDate)}</p>
                  <p className="text-xs text-stone-500 mt-1">{b.items.map((i) => `${i.quantity}x ${i.equipment.name}`).join(", ")}</p>
                  <p className="text-sm font-semibold text-forest-700 mt-1">{formatCurrency(b.totalPrice)} <span className="text-xs font-normal text-stone-400">deposit {formatCurrency(b.depositAmount)}</span></p>
                </div>
                <div className="flex flex-wrap gap-2 items-start">
                  <button onClick={() => copyConfirmation(b)} className="flex items-center gap-1 text-xs bg-forest-100 hover:bg-forest-200 text-forest-800 px-3 py-2 rounded-lg font-medium transition-colors">
                    {copied === b.id ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === b.id ? "Tersalin!" : "Salin Konfirmasi"}
                  </button>
                  {b.status === "CONFIRMED" && <button onClick={() => updateStatus(b.id, "ACTIVE")} className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg font-medium">Aktifkan</button>}
                  {b.status === "ACTIVE" && <button onClick={() => updateStatus(b.id, "COMPLETED")} className="text-xs bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium">Selesai</button>}
                  {(b.status === "CONFIRMED" || b.status === "ACTIVE") && <button onClick={() => updateStatus(b.id, "CANCELLED")} className="text-xs bg-red-100 text-red-700 px-3 py-2 rounded-lg font-medium">Batalkan</button>}
                  <button onClick={() => deleteBooking(b.id)} className="text-xs text-red-400 hover:text-red-600 px-2 py-2"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-stone-400">
              <p className="text-4xl mb-3">📋</p>
              <p>Tidak ada booking ditemukan</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
