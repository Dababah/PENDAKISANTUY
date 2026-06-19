// src/app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateBookingCode } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const date = searchParams.get("date");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (date) {
      const d = new Date(date);
      where.OR = [
        { startDate: { lte: d }, endDate: { gte: d } },
      ];
    }

    const bookings = await prisma.manualBooking.findMany({
      where,
      include: { items: { include: { equipment: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, startDate, endDate, depositAmount, notes, items } = body;

    // Validate stock availability
    for (const item of items) {
      const equipment = await prisma.equipment.findUnique({
        where: { id: item.equipmentId },
      });
      if (!equipment) {
        return NextResponse.json({ error: `Equipment not found: ${item.equipmentId}` }, { status: 400 });
      }

      // Check overlapping bookings
      const overlapping = await prisma.manualBookingItem.aggregate({
        _sum: { quantity: true },
        where: {
          equipmentId: item.equipmentId,
          booking: {
            status: { in: ["CONFIRMED", "ACTIVE"] },
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) },
          },
        },
      });

      const reserved = overlapping._sum.quantity ?? 0;
      if (reserved + item.quantity > equipment.totalStock) {
        return NextResponse.json(
          { error: `Stok tidak cukup untuk: ${equipment.name}` },
          { status: 400 }
        );
      }
    }

    // Calculate total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    let totalPrice = 0;
    for (const item of items) {
      const equipment = await prisma.equipment.findUnique({ where: { id: item.equipmentId } });
      if (equipment) totalPrice += equipment.pricePerDay * item.quantity * days;
    }

    const booking = await prisma.manualBooking.create({
      data: {
        bookingCode: generateBookingCode(),
        customerName,
        customerPhone,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        depositAmount,
        notes,
        items: {
          create: items.map((i: { equipmentId: string; quantity: number }) => ({
            equipmentId: i.equipmentId,
            quantity: i.quantity,
          })),
        },
      },
      include: { items: { include: { equipment: true } } },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
