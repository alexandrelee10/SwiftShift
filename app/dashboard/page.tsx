import { requireUser } from "@/lib/requireUser";
import Image from "next/image"
import {
  Truck,
  CircleCheckBig,
  Landmark,
  FuelIcon
} from "lucide-react"

export default async function DashboardPage() {
  const session = await requireUser();

  const upperIcons = [
    {
      name: "Active Loads",
      content: 2,
      status: "In Transit",
      icon: Truck,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Delivered (30d)",
      content: "8",
      status: "+14% vs last 30d",
      icon: CircleCheckBig,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Earnings",
      content: "$10,956",
      status: "+*% vs last 30d",
      icon: Landmark,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      name: "Fuel Spending (30d)",
      content: "$3,123",
      status: "-10% vs last 30d",
      icon: FuelIcon,
      color: "bg-red-100 text-red-600",
    },
  ];
  return (
    <div className="min-h-screen bg-zinc-100">
      <main className="min-w-0">

        <div className="">
          <div className="p-4 flex flex-col">
            <div>
              <h2 className="text-zinc-700 font-bold text-xl">Welcome, {session.user?.name}!</h2>
              <p className="text-sm text-zinc-500 ">Here's what's happening with your loads today</p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
              {upperIcons.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                  >
                    {/* Icon LEFT */}
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
                    >
                      <Icon size={22} />
                    </div>

                    {/* Content RIGHT */}
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-zinc-500">
                        {item.name}
                      </p>

                      <p className="text-xl font-bold text-zinc-900">
                        {item.content}
                      </p>

                      <p className="text-xs text-zinc-500">
                        {item.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}