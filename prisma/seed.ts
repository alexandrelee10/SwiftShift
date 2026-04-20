import "dotenv/config";
import { PrismaClient, UserRole, LoadStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding...");

  await prisma.trip.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.load.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  const broker = await prisma.user.create({
    data: {
      firstName: "Test",
      lastName: "Broker",
      phoneNum: "1111111111",
      email: "broker@test.com",
      password,
      role: UserRole.BROKER,
    },
  });

  const driver = await prisma.user.create({
    data: {
      firstName: "Test",
      lastName: "Driver",
      phoneNum: "2222222222",
      email: "driver@test.com",
      password,
      role: UserRole.DRIVER,
    },
  });

  await prisma.load.create({
    data: {
      brokerId: broker.id,
      referenceNumber: "LOAD001",
      originCity: "Miami",
      originState: "FL",
      originAddress: "123 St",
      destinationCity: "Atlanta",
      destinationState: "GA",
      destinationAddress: "456 St",
      pickupDate: new Date(),
      equipmentType: "Dry Van",
      weight: 45000,
      rate: "2500.00",
      status: LoadStatus.POSTED,
    },
  });

  console.log("✅ Done seeding");
  console.log("Broker:", broker.email);
  console.log("Driver:", driver.email);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });