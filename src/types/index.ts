export type BookingStatus = "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

// Penambahan skema tipe data internal untuk riwayat rental aktif
export interface ActiveBookingInfo {
  endDate: string;
  quantity: number;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  totalStock: number;
  pricePerDay: number;
  imageUrl?: string | null;
  description?: string | null;
  weight?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Ditambahkan field baru untuk melacak booking aktif dari API backend
  activeBookings?: ActiveBookingInfo[];
}

export interface CartItem {
  equipment: Equipment;
  quantity: number;
}

export interface ManualBookingItem {
  id: string;
  bookingId: string;
  equipmentId: string;
  quantity: number;
  equipment: Equipment;
}

export interface ManualBooking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  depositAmount: number;
  notes?: string | null;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  items: ManualBookingItem[];
}

export interface CreateBookingInput {
  customerName: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  depositAmount: number;
  notes?: string;
  items: Array<{
    equipmentId: string;
    quantity: number;
  }>;
}
