import prisma from "@/lib/prisma";
import { LoadStatus, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const cities = [
  { city: "Miami", state: "FL" },
  { city: "Orlando", state: "FL" },
  { city: "Tampa", state: "FL" },
  { city: "Atlanta", state: "GA" },
  { city: "Dallas", state: "TX" },
  { city: "Houston", state: "TX" },
  { city: "Chicago", state: "IL" },
  { city: "Nashville", state: "TN" },
  { city: "Charlotte", state: "NC" },
  { city: "Phoenix", state: "AZ" },
];

const equipmentTypes = ["Dry Van", "Reefer", "Flatbed"];

function randomFromArray<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomRate() {
  return (1800 + Math.random() * 2000).toFixed(2);
}

function randomWeight() {
  return Math.floor(20000 + Math.random() * 30000);
}

function randomMiles() {
  return Math.floor(250 + Math.random() * 1500);
}

async function seedLoads(brokerId: string) {
  const loads: Prisma.LoadCreateManyInput[] = [];

  for (let i = 1; i <= 25; i++) {
    let origin = randomFromArray(cities);
    let destination = randomFromArray(cities);

    while (destination.city === origin.city) {
      destination = randomFromArray(cities);
    }

    const pickupDate = new Date(Date.now() + i * 86400000);
    const deliveryDate = new Date(pickupDate.getTime() + 2 * 86400000);

    loads.push({
      brokerId,
      referenceNumber: `LOAD${String(i).padStart(3, "0")}`,
      originCity: origin.city,
      originState: origin.state,
      originAddress: `${Math.floor(Math.random() * 999)} Main St`,
      destinationCity: destination.city,
      destinationState: destination.state,
      destinationAddress: `${Math.floor(Math.random() * 999)} Market St`,
      pickupDate,
      deliveryDate,
      equipmentType: randomFromArray(equipmentTypes),
      weight: randomWeight(),
      commodity: "General Freight",
      rate: randomRate(),
      distanceMiles: randomMiles(),
      status: LoadStatus.POSTED,
    });

    
  }

  await prisma.load.createMany({
    data: loads,
  });

  console.log("✅ Loads seeded successfully");
}

async function main() {
  console.log("🌱 Seed started");

  // Delete loads first because loads depend on users
  await prisma.load.deleteMany();

  const password = "password123"

  const hashedPassword = await bcrypt.hash(password, 10);

const broker = await prisma.user.upsert({
  where: {
    email: "broker@test.com",
  },
  update: {
    password: hashedPassword,
    phoneNum: "5550001000",
    role: "BROKER",
  },
  create: {
    firstName: "Demo",
    lastName: "Broker",
    email: "broker@test.com",
    phoneNum: "5550001000",
    password: hashedPassword,
    role: "BROKER",
  },
});

const driver = await prisma.user.upsert({
  where: {
    email: "driver@test.com",
  },
  update: {
    password: hashedPassword,
    phoneNum: "5550002000",
    role: "DRIVER",
  },
  create: {
    firstName: "Demo",
    lastName: "Driver",
    email: "driver@test.com",
    phoneNum: "5550002000",
    password: hashedPassword,
    role: "DRIVER",
  },
});
  console.log("Broker found/created:", broker.id);
  console.log("Driver found/created:", driver.id);

  await seedLoads(broker.id);

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
