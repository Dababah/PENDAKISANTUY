"use client";
// src/app/admin/calendar/page.tsx
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ManualBooking, Equipment } from "@/types";
import { getStatusColor, getStatusLabel } from "@/lib/utils";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval } from "date-fns";
import { id } from "date-fns/locale";

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-blue-400",
  ACTIVE: "bg-green-500",
  COMPLETED: "bg-gray-400",
  CANCELLED: "bg-red-400",
};

export default function CalendarPage() {
  const [bookings, setBookings] = useState<ManualBooking[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ManualBooking | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const [br, er] = await Promise.all([fetch("/api/bookings"), fetch("/api/equipment")]);
    setBookings(await br.json());
    setEquipment(await er.json());
    setLoading(false);
  }

  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });

  function getBookingsForEquipmentOnDay(equipmentId: string, day: Date) {
    return bookings.filter((b) => {
      if (b.status === "CANCELLED") return false;
      const hasItem = b.items.some((i) => i.equipmentId === equipmentId);
      if (!hasItem) return false;
      return isWithinInterval(day, { start: new Date(b.startDate), end: new Date(b.endDate) });
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-stone-800">Kalender Visual</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-stone-700 min-w-32 text-center">
            {format(currentMonth, "MMMM yyyy", { locale: id })}
          </span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5 text-xs text-stone-600">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            {getStatusLabel(status)}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="h-64 animate-pulse bg-stone-100 rounded-xl" />
      ) : (
        <div className="card overflow-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="text-left px-3 py-3 bg-stone-50 border-b border-stone-100 font-semibold text-stone-600 sticky left-0 z-10 min-w-32">
                  Alat
                </th>
                {days.map((day) => (
                  <th
                    key={day.toISOString()}
                    className={`px-1 py-3 text-center min-w-8 border-b border-stone-100 font-medium ${isSameDay(day, new Date()) ? "bg-forest-50 text-forest-700" : "bg-stone-50 text-stone-500"}`}
                  >
                    <div>{format(day, "d")}</div>
                    <div className="text-[10px] opacity-60">{format(day, "EEE", { locale: id })}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {equipment.map((eq) => (
                <tr key={eq.id} className="border-b border-stone-50 hover:bg-stone-50">
                  <td className="px-3 py-2 sticky left-0 bg-white border-r border-stone-100 z-10">
                    <div className="font-medium text-stone-800 whitespace-nowrap">{eq.name}</div>
                    <div className="text-stone-400">Stok: {eq.totalStock}</div>
                  </td>
                  {days.map((day) => {
                    const dayBookings = getBookingsForEquipmentOnDay(eq.id, day);
                    const isToday = isSameDay(day, new Date());
                    return (
                      <td
                        key={day.toISOString()}
                        className={`text-center p-0.5 ${isToday ? "bg-forest-50" : ""}`}
                      >
                        {dayBookings.map((b) => {
                          const item = b.items.find((i) => i.equipmentId === eq.id);
                          return (
                            <button
                              key={b.id}
                              onClick={() => setSelected(b)}
                              title={`${b.customerName} (${b.bookingCode})`}
                              className={`w-full rounded text-[9px] font-medium text-white py-0.5 px-0.5 mb-0.5 truncate ${STATUS_COLORS[b.status] ?? "bg-gray-400"} hover:opacity-80 transition-opacity`}
                            >
                              {item?.quantity}x
                            </button>
                          );
                        })}
                        {dayBookings.length === 0 && (
                          <div className="w-full h-5 rounded" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-stone-800">{selected.bookingCode}</span>
              <span className={`badge ${getStatusColor(selected.status)}`}>{getStatusLabel(selected.status)}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-stone-500">Pelanggan</span><span className="font-medium">{selected.customerName}</span></div>
              <div className="flex justify-between"><span className="text-stone-500">HP</span><span className="font-medium">{selected.customerPhone}</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Periode</span><span className="font-medium">{format(new Date(selected.startDate), "d MMM")} → {format(new Date(selected.endDate), "d MMM yyyy")}</span></div>
              <div>
                <span className="text-stone-500">Alat:</span>
                <ul className="mt-1 space-y-1">
                  {selected.items.map((i) => (
                    <li key={i.id} className="text-stone-700">• {i.quantity}x {i.equipment.name}</li>
                  ))}
                </ul>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="mt-4 w-full btn-outline text-sm py-2">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
