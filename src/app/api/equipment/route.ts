import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

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

    const equipmentData = await prisma.equipment.findMany({
      where,
      include: {
        bookingItems: {
          where: {
            booking: {
              status: { in: ["CONFIRMED", "ACTIVE"] },
              endDate: { gte: new Date() },
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

    const responseData = equipmentData.map((eq) => {
      const activeBookings = eq.bookingItems.map((item) => ({
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
        activeBookings,
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
    // Membaca data form-data menggunakan parameter 'req' yang benar
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const totalStock = Number(formData.get("totalStock"));
    const pricePerDay = Number(formData.get("pricePerDay"));
    const description = (formData.get("description") as string) || "";
    const weight = (formData.get("weight") as string) || "";
    const imageFile = formData.get("image") as File | null;

    let imageUrl = null;

    // Proses simpan gambar ke folder lokal public/uploads
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Tentukan lokasi folder tujuan (public/uploads)
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      // Validasi: Bikin foldernya otomatis jika belum ada di project
      await fs.mkdir(uploadDir, { recursive: true });

      // Berikan nama file unik biar tidak saling menimpa
      const fileExtension = imageFile.name.split(".").pop();
      const fileName = `equipment-${Date.now()}.${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      // Tulis file biner ke local storage server
      await fs.writeFile(filePath, buffer);

      // Path inilah yang bisa diakses langsung oleh tag <img src={eq.imageUrl} /> di frontend
      imageUrl = `/uploads/${fileName}`;
    }

    // Simpan data ke database melalui Prisma
    const equipment = await prisma.equipment.create({
      data: {
        name,
        category,
        totalStock,
        pricePerDay,
        description,
        weight,
        imageUrl,
      },
    });

    return NextResponse.json(equipment, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Failed to create equipment" },
      { status: 500 },
    );
  }
}
