import Image from "next/image";
import loadCount from "@/public/assets/dashboard/load_count_new_logo.png";

const marketData = [
  { state: "AK", inbound: 5, outbound: 7 },
  { state: "AL", inbound: 1044, outbound: 528 },
  { state: "AR", inbound: 724, outbound: 801 },
  { state: "AZ", inbound: 291, outbound: 566 },
  { state: "CA", inbound: 2052, outbound: 1841 },
  { state: "CO", inbound: 845, outbound: 516 },
  { state: "CT", inbound: 324, outbound: 197 },
  { state: "DC", inbound: 25, outbound: 6 },
  { state: "DE", inbound: 64, outbound: 90 },
  { state: "FL", inbound: 3188, outbound: 571 },
  { state: "GA", inbound: 2907, outbound: 809 },
  { state: "IA", inbound: 681, outbound: 431 },
  { state: "ID", inbound: 142, outbound: 198 },
  { state: "IL", inbound: 2039, outbound: 3921 },
  { state: "IN", inbound: 1476, outbound: 2543 },
  { state: "KS", inbound: 879, outbound: 935 },
  { state: "KY", inbound: 965, outbound: 1204 },
  { state: "LA", inbound: 756, outbound: 688 },
  { state: "MA", inbound: 512, outbound: 430 },
  { state: "MD", inbound: 678, outbound: 590 },
  { state: "ME", inbound: 89, outbound: 120 },
  { state: "MI", inbound: 1345, outbound: 1780 },
  { state: "MN", inbound: 890, outbound: 1102 },
  { state: "MO", inbound: 1203, outbound: 1455 },
  { state: "MS", inbound: 410, outbound: 390 },
  { state: "MT", inbound: 76, outbound: 102 },
  { state: "NC", inbound: 1750, outbound: 980 },
  { state: "ND", inbound: 95, outbound: 140 },
  { state: "NE", inbound: 430, outbound: 520 },
  { state: "NH", inbound: 110, outbound: 95 },
  { state: "NJ", inbound: 980, outbound: 870 },
  { state: "NM", inbound: 210, outbound: 260 },
  { state: "NV", inbound: 350, outbound: 480 },
  { state: "NY", inbound: 1650, outbound: 1400 },
  { state: "OH", inbound: 1890, outbound: 2100 },
  { state: "OK", inbound: 620, outbound: 710 },
  { state: "OR", inbound: 540, outbound: 620 },
  { state: "PA", inbound: 1720, outbound: 1600 },
  { state: "RI", inbound: 70, outbound: 65 },
  { state: "SC", inbound: 880, outbound: 760 },
  { state: "SD", inbound: 120, outbound: 150 },
  { state: "TN", inbound: 1350, outbound: 1250 },
  { state: "TX", inbound: 2450, outbound: 2210 },
  { state: "UT", inbound: 390, outbound: 470 },
  { state: "VA", inbound: 980, outbound: 910 },
  { state: "VT", inbound: 60, outbound: 55 },
  { state: "WA", inbound: 780, outbound: 860 },
  { state: "WI", inbound: 920, outbound: 1040 },
  { state: "WV", inbound: 210, outbound: 180 },
  { state: "WY", inbound: 65, outbound: 80 },
];

export default function MarketSnapshot() {
  return (
    <aside>
      <div className="sticky top-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col items-center justify-center pb-10">
          <div className="rounded-xl">
            <Image
              src={loadCount}
              alt="load count cover"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
        </div>

        <div className="mb-3 grid grid-cols-3 border-b border-zinc-200 pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          <span>ST</span>
          <span className="text-center">Loads In</span>
          <span className="text-right">Loads Out</span>
        </div>

        <div className="max-h-[500px] space-y-3 overflow-y-auto pr-1">
          {marketData.map((item) => (
            <div
              key={item.state}
              className="grid grid-cols-3 items-center rounded-lg px-2 py-2 transition hover:bg-zinc-50"
            >
              <span className="text-sm font-medium text-zinc-900">
                {item.state}
              </span>

              <span className="text-center text-sm text-zinc-700">
                {item.inbound}
              </span>

              <span className="text-right text-sm text-zinc-700">
                {item.outbound}
              </span>

              <div className="col-span-3 mt-2 h-2 overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: `${(item.inbound / (item.inbound + item.outbound)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}