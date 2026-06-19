// src/lib/utils.ts
import { format, differenceInDays, addDays } from "date-fns";
import { id } from "date-fns/locale";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d MMMM yyyy", { locale: id });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d MMM yyyy", { locale: id });
}

export function calculateDays(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const diff = differenceInDays(end, start);
  return diff < 1 ? 1 : diff;
}

export function generateBookingCode(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `PS-${year}-${random}`;
}

export function buildWhatsAppMessage(
  items: Array<{ name: string; quantity: number; id: string }>,
  startDate: string,
  endDate: string,
  customerName: string
): string {
  const days = calculateDays(startDate, endDate);
  const itemList = items
    .map((i) => `- ${i.quantity}x ${i.name} (#${i.id.slice(0, 8).toUpperCase()})`)
    .join("\n");

  return encodeURIComponent(
    `Halo Admin PendakiSantuy, saya ingin menyewa alat berikut:\n\n${itemList}\n\nPeriode Sewa: ${formatDate(startDate)} s/d ${formatDate(endDate)} (${days} Hari)\n\nNama: ${customerName}`
  );
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
    ACTIVE: "bg-green-100 text-green-800 border-green-200",
    COMPLETED: "bg-gray-100 text-gray-800 border-gray-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
  };
  return colors[status] ?? "bg-gray-100 text-gray-800";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    CONFIRMED: "Dikonfirmasi",
    ACTIVE: "Aktif",
    COMPLETED: "Selesai",
    CANCELLED: "Dibatalkan",
  };
  return labels[status] ?? status;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
