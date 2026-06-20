// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai proses pembersihan database...");

  // 1. Bersihkan transaksi lama terlebih dahulu untuk menghindari Foreign Key Constraint Error
  await prisma.manualBookingItem.deleteMany({});
  await prisma.manualBooking.deleteMany({});
  await prisma.equipment.deleteMany({});

  console.log("🌱 Memasukkan data perlengkapan gunung baru...");

  const equipments = [
    {
      name: "Tenda Dome 2 Orang",
      category: "Tenda",
      totalStock: 5,
      pricePerDay: 75000,
      imageUrl:
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80",
      description:
        "Tenda dome ringan, waterproof, gampang didirikan, cocok untuk 2 orang",
      weight: "2.5 kg",
    },
    {
      name: "Tenda Dome 4 Orang",
      category: "Tenda",
      totalStock: 3,
      pricePerDay: 120000,
      imageUrl:
        "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&q=80",
      description:
        "Tenda dome luas dengan teras depan, waterproof, cocok untuk grup 4 orang",
      weight: "3.8 kg",
    },
    {
      name: "Carrier 60L",
      category: "Carrier",
      totalStock: 8,
      pricePerDay: 50000,
      imageUrl:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
      description:
        "Carrier besar 60L dengan adjustable frame internal, nyaman untuk jalur panjang",
      weight: "1.8 kg",
    },
    {
      name: "Carrier 40L",
      category: "Carrier",
      totalStock: 6,
      pricePerDay: 35000,
      imageUrl:
        "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=600&q=80",
      description:
        "Carrier medium 40L, sangat ideal untuk pendakian santai atau tek-tok 1-2 hari",
      weight: "1.2 kg",
    },
    {
      name: "Sleeping Bag -5°C",
      category: "Sleeping Bag",
      totalStock: 10,
      pricePerDay: 40000,
      imageUrl:
        "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?w=600&q=80",
      description:
        "Sleeping bag dacron polar tebal, menjaga suhu tubuh nyaman hingga ekstrem -5°C",
      weight: "1.1 kg",
    },
    {
      name: "Sleeping Bag 10°C",
      category: "Sleeping Bag",
      totalStock: 8,
      pricePerDay: 25000,
      imageUrl:
        "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&q=80",
      description:
        "Sleeping bag standar berbahan ringan untuk cuaca gunung tropis sedang",
      weight: "0.8 kg",
    },
    {
      name: "Matras Sleeping Pad",
      category: "Matras",
      totalStock: 12,
      pricePerDay: 15000,
      imageUrl:
        "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80",
      description:
        "Matras foam gulung anti-slip untuk alas tidur dan isolasi hawa dingin tanah",
      weight: "0.4 kg",
    },
    {
      name: "Kompor Portable + Tabung",
      category: "Masak",
      totalStock: 7,
      pricePerDay: 30000,
      imageUrl:
        "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=600&q=80",
      description:
        "Kompor gas portable mini dengan burner mawar penahan angin, include adapter",
      weight: "0.5 kg",
    },
    {
      name: "Nesting Cook Set",
      category: "Masak",
      totalStock: 6,
      pricePerDay: 20000,
      imageUrl:
        "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=600&q=80",
      description:
        "Set peralatan masak alumunium kompak (panci penanak, wajan penggorengan, mangkok)",
      weight: "0.6 kg",
    },
    {
      name: "Headlamp",
      category: "Aksesoris",
      totalStock: 15,
      pricePerDay: 15000,
      imageUrl:
        "https://images.unsplash.com/photo-1554734867-bf3c00a49371?w=600&q=80",
      description:
        "Senter kepala LED super terang, water-resistant, baterai awet untuk muncak malam",
      weight: "0.1 kg",
    },
    {
      name: "Trekking Pole (pair)",
      category: "Aksesoris",
      totalStock: 8,
      pricePerDay: 25000,
      imageUrl:
        "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&q=80",
      description:
        "Tongkat hiking adjustable dengan antishock, bahan aluminium alloy, isi 1 pasang",
      weight: "0.5 kg",
    },
    {
      name: "Rain Cover Carrier",
      category: "Aksesoris",
      totalStock: 10,
      pricePerDay: 10000,
      imageUrl:
        "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80",
      description:
        "Penutup pelindung air hujan mutlak untuk tas carrier ukuran 45L-60L",
      weight: "0.1 kg",
    },
  ];

  // 2. Simpan semua data peralatan gunung
  for (const eq of equipments) {
    await prisma.equipment.create({
      data: eq,
    });
  }

  // 3. Ambil salah satu peralatan yang sukses dibuat untuk dijadikan contoh transaksi booking
  const sampleTent = await prisma.equipment.findFirst({
    where: { name: "Tenda Dome 2 Orang" },
  });

  if (sampleTent) {
    // 4. Inisialisasi data ManualBooking bawaan pertama
    await prisma.manualBooking.upsert({
      where: { bookingCode: "PS-2026-001" },
      update: {},
      create: {
        bookingCode: "PS-2026-001",
        customerName: "Fawwaz",
        customerPhone: "08123456789",
        startDate: new Date("2026-07-10"),
        endDate: new Date("2026-07-12"),
        totalPrice: 150000,
        depositAmount: 100000,
        status: "CONFIRMED",
        // PERBAIKAN: Menggunakan nama argumen relasi 'items' sesuai validasi skema database
        items: {
          create: [{ equipmentId: sampleTent.id, quantity: 1 }],
        },
      },
    });
  }

  console.log("✅ Proses seeding database berhasil diselesaikan!");
}

main()
  .catch((e) => {
    console.error("❌ Terjadi kesalahan saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
