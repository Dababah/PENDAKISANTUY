// src/app/api/bookings/[id]/route.ts

// Memaksa rute API ini diperlakukan sebagai dynamic server-side route runtime
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const booking = await prisma.manualBooking.findUnique({
      where: { id: params.id },
      include: { items: { include: { equipment: true } } },
    });

    if (!booking) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("GET Booking Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const booking = await prisma.manualBooking.update({
      where: { id: params.id },
      data: { status: body.status },
      include: { items: { include: { equipment: true } } },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("PATCH Booking Error:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.manualBooking.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Booking Error:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 },
    );
  }
}
