// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const equipments = [
    {
      name: "Tenda Dome 2 Orang",
      category: "Tenda",
      totalStock: 5,
      pricePerDay: 75000,
      description: "Tenda dome ringan, waterproof, cocok untuk 2 orang",
      weight: "2.5 kg",
    },
    {
      name: "Tenda Dome 4 Orang",
      category: "Tenda",
      totalStock: 3,
      pricePerDay: 120000,
      description: "Tenda dome luas, waterproof, cocok untuk grup 4 orang",
      weight: "3.8 kg",
    },
    {
      name: "Carrier 60L",
      category: "Carrier",
      totalStock: 8,
      pricePerDay: 50000,
      description: "Carrier besar 60L dengan frame internal, cocok untuk pendakian multi-hari",
      weight: "1.8 kg",
    },
    {
      name: "Carrier 40L",
      category: "Carrier",
      totalStock: 6,
      pricePerDay: 35000,
      description: "Carrier medium 40L, ideal untuk pendakian 1-2 hari",
      weight: "1.2 kg",
    },
    {
      name: "Sleeping Bag -5°C",
      category: "Sleeping Bag",
      totalStock: 10,
      pricePerDay: 40000,
      description: "Sleeping bag polar, nyaman hingga -5 derajat Celsius",
      weight: "1.1 kg",
    },
    {
      name: "Sleeping Bag 10°C",
      category: "Sleeping Bag",
      totalStock: 8,
      pricePerDay: 25000,
      description: "Sleeping bag standar untuk cuaca tidak terlalu dingin",
      weight: "0.8 kg",
    },
    {
      name: "Matras Sleeping Pad",
      category: "Matras",
      totalStock: 12,
      pricePerDay: 15000,
      description: "Matras foam untuk tidur, isolasi dari tanah",
      weight: "0.4 kg",
    },
    {
      name: "Kompor Portable + Tabung",
      category: "Masak",
      totalStock: 7,
      pricePerDay: 30000,
      description: "Kompor gas portable dengan tabung, cocok untuk memasak di gunung",
      weight: "0.5 kg",
    },
    {
      name: "Nesting Cook Set",
      category: "Masak",
      totalStock: 6,
      pricePerDay: 20000,
      description: "Set peralatan masak kompak (panci, wajan, sendok)",
      weight: "0.6 kg",
    },
    {
      name: "Headlamp",
      category: "Aksesoris",
      totalStock: 15,
      pricePerDay: 15000,
      description: "Senter kepala LED, tahan air, baterai tahan lama",
      weight: "0.1 kg",
    },
    {
      name: "Trekking Pole (pair)",
      category: "Aksesoris",
      totalStock: 8,
      pricePerDay: 25000,
      description: "Tongkat hiking adjustable, aluminium, 1 pasang",
      weight: "0.5 kg",
    },
    {
      name: "Rain Cover Carrier",
      category: "Aksesoris",
      totalStock: 10,
      pricePerDay: 10000,
      description: "Penutup hujan untuk carrier, waterproof",
      weight: "0.1 kg",
    },
  ];

  for (const eq of equipments) {
    await prisma.equipment.upsert({
      where: { id: eq.name },
      update: {},
      create: eq,
    });
  }

  // Create sample booking
  const firstEquipment = await prisma.equipment.findFirst();
  if (firstEquipment) {
    await prisma.manualBooking.upsert({
      where: { bookingCode: "PS-2026-001" },
      update: {},
      create: {
        bookingCode: "PS-2026-001",
        customerName: "Fawwaz",
        customerPhone: "08123456789",
        startDate: new Date("2026-07-10"),
        endDate: new Date("2026-07-12"),
        totalPrice: 300000,
        depositAmount: 200000,
        status: "CONFIRMED",
        items: {
          create: [
            { equipmentId: firstEquipment.id, quantity: 1 },
          ],
        },
      },
    });
  }

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
