"use client";
// src/hooks/useCart.ts
import { useState, useEffect, useCallback } from "react";
import { Equipment, CartItem } from "@/types";

const CART_KEY = "pendakisantuy_cart";
const DATES_KEY = "pendakisantuy_dates";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    const dates = localStorage.getItem(DATES_KEY);
    if (stored) setItems(JSON.parse(stored));
    if (dates) {
      const { start, end } = JSON.parse(dates);
      setStartDate(start ?? "");
      setEndDate(end ?? "");
    }
  }, []);

  const saveItems = (newItems: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(newItems));
    setItems(newItems);
  };

  const saveDates = (start: string, end: string) => {
    localStorage.setItem(DATES_KEY, JSON.stringify({ start, end }));
    setStartDate(start);
    setEndDate(end);
  };

  const addItem = useCallback((equipment: Equipment, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.equipment.id === equipment.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((i) =>
          i.equipment.id === equipment.id
            ? { ...i, quantity: Math.min(i.quantity + qty, equipment.totalStock) }
            : i
        );
      } else {
        updated = [...prev, { equipment, quantity: qty }];
      }
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeItem = useCallback((equipmentId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.equipment.id !== equipmentId);
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateQty = useCallback((equipmentId: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => {
      const updated = prev.map((i) =>
        i.equipment.id === equipmentId ? { ...i, quantity: qty } : i
      );
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_KEY);
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const totalPrice = (days: number) =>
    items.reduce((sum, i) => sum + i.equipment.pricePerDay * i.quantity * days, 0);

  return {
    items,
    startDate,
    endDate,
    setStartDate: (d: string) => saveDates(d, endDate),
    setEndDate: (d: string) => saveDates(startDate, d),
    addItem,
    removeItem,
    updateQty,
    clearCart,
    totalItems,
    totalPrice,
  };
}
