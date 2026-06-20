import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

interface Params {
  params: { id: string };
}

// 1. PUT: Mengubah data alat (Bisa ganti detail teks saja atau sekaligus ganti gambar dari galeri HP)
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const formData = await req.formData(); // Menangkap data multipart/form-data

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const totalStock = Number(formData.get("totalStock"));
    const pricePerDay = Number(formData.get("pricePerDay"));
    const description = (formData.get("description") as string) || "";
    const weight = (formData.get("weight") as string) || "";
    const imageFile = formData.get("image") as File | null;

    // Ambil data lama untuk mempertahankan imageUrl lama jika admin tidak mengganti gambar
    const currentEquipment = await prisma.equipment.findUnique({
      where: { id },
    });

    if (!currentEquipment) {
      return NextResponse.json(
        { error: "Alat tidak ditemukan" },
        { status: 404 },
      );
    }

    let imageUrl = currentEquipment.imageUrl;

    // Jika admin memilih berkas gambar baru dari galeri HP-nya
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Tentukan lokasi direktori penyimpanan lokal
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      // Berikan nama unik berbasis timestamp agar tidak menimpa file yang sudah ada
      const fileExtension = imageFile.name.split(".").pop();
      const fileName = `equipment-${Date.now()}.${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      // Tulis file baru ke dalam folder public/uploads
      await fs.writeFile(filePath, buffer);

      // Opsional: Hapus file gambar lama dari server lokal jika ada agar tidak memenuhi storage
      if (
        currentEquipment.imageUrl &&
        currentEquipment.imageUrl.startsWith("/uploads/")
      ) {
        const oldFilePath = path.join(
          process.cwd(),
          "public",
          currentEquipment.imageUrl,
        );
        await fs.unlink(oldFilePath).catch(() => {
          // Abaikan error jika file lama ternyata memang sudah terhapus secara manual sebelumnya
        });
      }

      imageUrl = `/uploads/${fileName}`;
    }

    // Perbarui data rekaman di database
    const updatedEquipment = await prisma.equipment.update({
      where: { id },
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

    return NextResponse.json(updatedEquipment);
  } catch (error: any) {
    console.error("PUT_EQUIPMENT_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update equipment" },
      { status: 500 },
    );
  }
}

// 2. DELETE: Menghapus data alat beserta berkas gambar fisiknya di local folder
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    // Cari tahu detail alat sebelum dihapus untuk mengecek path gambarnya
    const targetEquipment = await prisma.equipment.findUnique({
      where: { id },
    });

    if (!targetEquipment) {
      return NextResponse.json(
        { error: "Alat tidak ditemukan" },
        { status: 404 },
      );
    }

    // Hapus file gambar dari folder public/uploads terlebih dahulu
    if (
      targetEquipment.imageUrl &&
      targetEquipment.imageUrl.startsWith("/uploads/")
    ) {
      const filePath = path.join(
        process.cwd(),
        "public",
        targetEquipment.imageUrl,
      );
      await fs.unlink(filePath).catch(() => {});
    }

    // Hapus record dari database utama
    await prisma.equipment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE_EQUIPMENT_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete equipment" },
      { status: 500 },
    );
  }
}
