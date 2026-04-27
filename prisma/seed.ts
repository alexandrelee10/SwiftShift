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

export async function seedLoads(brokerId: string) {
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
}