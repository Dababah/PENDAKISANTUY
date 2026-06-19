"use client";
// src/app/admin/equipment/page.tsx
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Equipment } from "@/types";
import { formatCurrency } from "@/lib/utils";

const CATEGORIES = ["Tenda", "Carrier", "Sleeping Bag", "Matras", "Masak", "Aksesoris"];

const EMPTY_FORM = {
  name: "",
  category: "Tenda",
  totalStock: "",
  pricePerDay: "",
  description: "",
  weight: "",
};

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

  async function fetchEquipment() {
    const res = await fetch("/api/equipment");
    setEquipment(await res.json());
    setLoading(false);
  }

  function startEdit(eq: Equipment) {
    setEditing(eq);
    setForm({
      name: eq.name,
      category: eq.category,
      totalStock: String(eq.totalStock),
      pricePerDay: String(eq.pricePerDay),
      description: eq.description ?? "",
      weight: eq.weight ?? "",
    });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditing(null);
    setForm({ ...EMPTY_FORM });
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        totalStock: Number(form.totalStock),
        pricePerDay: Number(form.pricePerDay),
      };

      if (editing) {
        await fetch(`/api/equipment/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/equipment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      cancelForm();
      fetchEquipment();
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteEquipment(id: string) {
    if (!confirm("Hapus alat ini?")) return;
    await fetch(`/api/equipment/${id}`, { method: "DELETE" });
    fetchEquipment();
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = equipment.filter((e) => e.category === cat);
    return acc;
  }, {} as Record<string, Equipment[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-stone-800">Kelola Alat</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ ...EMPTY_FORM }); }} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
          <Plus className="w-4 h-4" /> Tambah Alat
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-5 border-forest-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-800">{editing ? "Edit Alat" : "Tambah Alat Baru"}</h2>
            <button onClick={cancelForm}><X className="w-5 h-5 text-stone-400" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Nama Alat *</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tenda Dome 2 Orang..." />
            </div>
            <div>
              <label className="label">Kategori *</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Total Stok *</label>
              <input type="number" className="input" value={form.totalStock} onChange={(e) => setForm({ ...form, totalStock: e.target.value })} placeholder="5" min="1" />
            </div>
            <div>
              <label className="label">Harga per Hari (Rp) *</label>
              <input type="number" className="input" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} placeholder="75000" />
            </div>
            <div>
              <label className="label">Berat</label>
              <input className="input" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="2.5 kg" />
            </div>
            <div>
              <label className="label">Deskripsi</label>
              <input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi singkat..." />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary text-sm py-2 px-5 flex items-center gap-2">
              <Check className="w-4 h-4" /> {submitting ? "Menyimpan..." : "Simpan"}
            </button>
            <button onClick={cancelForm} className="text-stone-500 hover:text-stone-700 text-sm">Batal</button>
          </div>
        </div>
      )}

      {/* Equipment by Category */}
      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 animate-pulse bg-stone-100 rounded-xl" />)}</div>
      ) : (
        CATEGORIES.map((cat) => grouped[cat]?.length > 0 && (
          <div key={cat}>
            <h2 className="font-semibold text-stone-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-forest-500" />
              {cat}
              <span className="text-xs text-stone-400 font-normal">({grouped[cat].length} item)</span>
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {grouped[cat].map((eq) => (
                <div key={eq.id} className="card p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-800 text-sm">{eq.name}</p>
                      {eq.weight && <p className="text-xs text-stone-400">{eq.weight}</p>}
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button onClick={() => startEdit(eq)} className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-forest-100 flex items-center justify-center transition-colors">
                        <Pencil className="w-3.5 h-3.5 text-stone-500" />
                      </button>
                      <button onClick={() => deleteEquipment(eq.id)} className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-red-100 flex items-center justify-center transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>
                  {eq.description && <p className="text-xs text-stone-500 mb-2 line-clamp-2">{eq.description}</p>}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-50">
                    <span className="font-bold text-forest-700 text-sm">{formatCurrency(eq.pricePerDay)}<span className="text-xs text-stone-400 font-normal">/hari</span></span>
                    <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">Stok: {eq.totalStock}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
