import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: Record<string, any> = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Ambil data perlengkapan beserta relasi booking yang sedang berjalan/akan datang
    const equipmentData = await prisma.equipment.findMany({
      where,
      include: {
        items: {
          where: {
            booking: {
              status: { in: ["CONFIRMED", "ACTIVE"] },
              endDate: { gte: new Date() }, // Masih atau akan disewa
            },
          },
          include: {
            booking: {
              select: {
                startDate: true,
                endDate: true,
              },
            },
          },
        },
      },
      orderBy: { category: "asc" },
    });

    // Petakan data ke bentuk ringkas yang dipahami Frontend
    const responseData = equipmentData.map((eq) => {
      const activeBookings = eq.items.map((item) => ({
        startDate: item.booking.startDate.toISOString().split("T")[0],
        endDate: item.booking.endDate.toISOString().split("T")[0],
        quantity: item.quantity,
      }));

      return {
        id: eq.id,
        name: eq.name,
        category: eq.category,
        totalStock: eq.totalStock,
        pricePerDay: eq.pricePerDay,
        imageUrl: eq.imageUrl,
        description: eq.description,
        weight: eq.weight,
        createdAt: eq.createdAt,
        updatedAt: eq.updatedAt,
        activeBookings, // Dipakai frontend untuk kalkulasi stok dinamis per tanggal
      };
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch equipment" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, totalStock, pricePerDay, description, weight } =
      body;

    const equipment = await prisma.equipment.create({
      data: { name, category, totalStock, pricePerDay, description, weight },
    });

    return NextResponse.json(equipment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create equipment" },
      { status: 500 },
    );
  }
}
