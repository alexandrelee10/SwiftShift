import prisma from "@/lib/prisma";
import { LoadStatus, Prisma } from "@prisma/client";

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

// Chooses a random element in an array
function randomFromArray<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
// Chooses a random rate
function randomRate() {
  return (1800 + Math.random() * 2000).toFixed(2);
}
// Chooses a random weight
function randomWeight() {
  return Math.floor(20000 + Math.random() * 30000);
}
// Chooses random miles
function randomMiles() {
  return Math.floor(250 + Math.random() * 1500);
}

async function seedLoads(brokerId: string) {
  const loads: Prisma.LoadCreateManyInput[] = []; // temp list to store all loads before saving them

  for (let i = 1; i <= 25; i++) {
    let origin = randomFromArray(cities);
    let destination = randomFromArray(cities);

    // ensures pick up and delivery aren't the same
    while (destination.city === origin.city) {
      destination = randomFromArray(cities);
    }

    const pickupDate = new Date(Date.now() + i * 86400000);
    const deliveryDate = new Date(pickupDate.getTime() + 2 * 86400000);
    // Creates the load 
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

  // This will load all the loads within the loads array inside of the db 
  await prisma.load.createMany({
    data: loads,
  });

  console.log("✅ Loads seeded successfully");
}

async function main() {
  console.log("🌱 Seed started");

  const broker = await prisma.user.findFirst();

  if (!broker) {
    throw new Error("No broker found. Create a user first.");
  }

  console.log("Broker found:", broker.id);

  // Prevent duplicate LOAD001, LOAD002, etc. errors when re-running seed
  await prisma.load.deleteMany();

  await seedLoads(broker.id);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });