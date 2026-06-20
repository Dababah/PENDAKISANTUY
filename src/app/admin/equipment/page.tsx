"use client";

// src/app/admin/equipment/page.tsx
import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Upload,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { Equipment } from "@/types";
import { formatCurrency } from "@/lib/utils";

const CATEGORIES = [
  "Tenda",
  "Carrier",
  "Sleeping Bag",
  "Matras",
  "Masak",
  "Aksesoris",
];

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

  // State Baru untuk File Gambar & Preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Jika data dari database sudah memiliki propertiimageUrl
    if (eq.imageUrl) {
      setImagePreview(eq.imageUrl);
    } else {
      setImagePreview(null);
    }
    setImageFile(null);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Handler saat admin memilih foto dari galeri HP / File Explorer
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal adalah 2MB.");
        return;
      }
      setImageFile(file);

      // Membuat URL Preview Lokal biner
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function handleSubmit() {
    if (!form.name || !form.totalStock || !form.pricePerDay) {
      alert("Mohon isi semua field wajib (*)");
      return;
    }

    setSubmitting(true);
    try {
      // Menggunakan FormData agar Next.js bisa menerima file raw biner dari client
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("totalStock", form.totalStock);
      formData.append("pricePerDay", form.pricePerDay);
      formData.append("description", form.description);
      formData.append("weight", form.weight);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editing) {
        await fetch(`/api/equipment/${editing.id}`, {
          method: "PUT",
          body: formData, // Kirim FormData langsung tanpa JSON.stringify dan headers content-type
        });
      } else {
        await fetch("/api/equipment", {
          method: "POST",
          body: formData,
        });
      }
      cancelForm();
      fetchEquipment();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteEquipment(id: string) {
    if (!confirm("Hapus alat ini?")) return;
    await fetch(`/api/equipment/${id}`, { method: "DELETE" });
    fetchEquipment();
  }

  const grouped = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = equipment.filter((e) => e.category === cat);
      return acc;
    },
    {} as Record<string, Equipment[]>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-stone-800">
          Kelola Alat
        </h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setForm({ ...EMPTY_FORM });
            setImageFile(null);
            setImagePreview(null);
          }}
          className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
          <Plus className="w-4 h-4" /> Tambah Alat
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-5 border-forest-200 bg-white rounded-2xl border shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-stone-800">
              {editing ? "Edit Alat" : "Tambah Alat Baru"}
            </h2>
            <button onClick={cancelForm}>
              <X className="w-5 h-5 text-stone-400 hover:text-stone-600" />
            </button>
          </div>

          {/* AREA FILE UPLOAD (GALERI) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-600 block">
              Foto Produk Alat
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              id="equipment-image-picker"
            />

            {!imagePreview ? (
              <label
                htmlFor="equipment-image-picker"
                className="flex flex-col items-center justify-center border-2 border-dashed border-stone-200 hover:border-forest-400 bg-stone-50/50 hover:bg-forest-50/20 rounded-xl p-6 cursor-pointer transition-all group">
                <div className="w-10 h-10 bg-white border border-stone-100 rounded-lg flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5 text-stone-500 group-hover:text-forest-600" />
                </div>
                <p className="text-xs font-semibold text-stone-700">
                  Pilih dari Galeri HP / File
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Maksimal resolusi file berkas 2MB
                </p>
              </label>
            ) : (
              <div className="relative w-max min-w-[200px] h-32 rounded-xl overflow-hidden border border-stone-200 bg-stone-50 group">
                <img
                  src={imagePreview}
                  alt="Preview Alat"
                  className="w-full h-full object-contain p-2"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label
                    htmlFor="equipment-image-picker"
                    className="bg-white/90 hover:bg-white text-stone-800 text-[11px] font-bold py-1 px-2.5 rounded-md cursor-pointer flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Ganti
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold py-1 px-2.5 rounded-md flex items-center gap-1">
                    <X className="w-3 h-3" /> Hapus
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form Input Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Nama Alat *</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Tenda Dome 2 Orang..."
              />
            </div>
            <div>
              <label className="label">Kategori *</label>
              <select
                className="input"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Total Stok *</label>
              <input
                type="number"
                className="input"
                value={form.totalStock}
                onChange={(e) =>
                  setForm({ ...form, totalStock: e.target.value })
                }
                placeholder="5"
                min="1"
              />
            </div>
            <div>
              <label className="label">Harga per Hari (Rp) *</label>
              <input
                type="number"
                className="input"
                value={form.pricePerDay}
                onChange={(e) =>
                  setForm({ ...form, pricePerDay: e.target.value })
                }
                placeholder="75000"
              />
            </div>
            <div>
              <label className="label">Berat</label>
              <input
                className="input"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="2.5 kg"
              />
            </div>
            <div>
              <label className="label">Deskripsi</label>
              <input
                className="input"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Deskripsi singkat..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary text-sm py-2 px-5 flex items-center gap-2">
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Simpan
                </>
              )}
            </button>
            <button
              onClick={cancelForm}
              className="text-stone-500 hover:text-stone-700 text-sm">
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Equipment by Category */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse bg-stone-100 rounded-xl"
            />
          ))}
        </div>
      ) : (
        CATEGORIES.map(
          (cat) =>
            grouped[cat]?.length > 0 && (
              <div key={cat} className="space-y-3">
                <h2 className="font-semibold text-stone-700 flex items-center gap-2 mt-4">
                  <span className="w-2 h-2 rounded-full bg-forest-500" />
                  {cat}
                  <span className="text-xs text-stone-400 font-normal">
                    ({grouped[cat].length} item)
                  </span>
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {grouped[cat].map((eq) => (
                    <div
                      key={eq.id}
                      className="card p-4 hover:shadow-md transition-shadow bg-white border border-stone-100 rounded-xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-stone-800 text-sm">
                              {eq.name}
                            </p>
                            {eq.weight && (
                              <p className="text-xs text-stone-400">
                                {eq.weight}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 ml-2">
                            <button
                              onClick={() => startEdit(eq)}
                              className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-forest-100 flex items-center justify-center transition-colors">
                              <Pencil className="w-3.5 h-3.5 text-stone-500" />
                            </button>
                            <button
                              onClick={() => deleteEquipment(eq.id)}
                              className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-red-100 flex items-center justify-center transition-colors">
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </div>
                        </div>

                        {/* Menampilkan mini-thumbnail foto produk di daftar kartu jika ada */}
                        {eq.imageUrl && (
                          <div className="w-full h-24 bg-stone-50 rounded-lg overflow-hidden border border-stone-100 mb-2 flex items-center justify-center">
                            <img
                              src={eq.imageUrl}
                              alt={eq.name}
                              className="h-full object-contain p-1"
                            />
                          </div>
                        )}

                        {eq.description && (
                          <p className="text-xs text-stone-500 mb-2 line-clamp-2">
                            {eq.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-50">
                        <span className="font-bold text-forest-700 text-sm">
                          {formatCurrency(eq.pricePerDay)}
                          <span className="text-xs text-stone-400 font-normal">
                            /hari
                          </span>
                        </span>
                        <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                          Stok: {eq.totalStock}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
        )
      )}
    </div>
  );
}
