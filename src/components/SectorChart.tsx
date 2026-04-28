"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SectorWeight } from "@/lib/types";

const BAR_COLOR = "#0f172a";

export function SectorChart({ sectorBreakdown }: { sectorBreakdown: SectorWeight[] }) {
  const data = [...sectorBreakdown]
    .sort((a, b) => b.weight - a.weight)
    .map((s) => ({ sector: s.sector, weight: Number((s.weight * 100).toFixed(1)) }));

  const chartHeight = Math.max(180, data.length * 32 + 32);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-900">Sector exposure</h3>
      <p className="mt-1 text-xs text-zinc-500">
        Weight of each sector in the portfolio.
      </p>

      <div className="mt-4 w-full" style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, "dataMax"]}
              tickFormatter={(v) => `${v}%`}
              stroke="#a1a1aa"
              fontSize={11}
            />
            <YAxis
              dataKey="sector"
              type="category"
              width={130}
              stroke="#52525b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "#f4f4f5" }}
              formatter={(value) => [`${Number(value).toFixed(1)}%`, "Weight"]}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #e4e4e7",
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="weight"
              radius={[0, 6, 6, 0]}
              isAnimationActive={false}
            >
              {data.map((entry) => (
                <Cell key={entry.sector} fill={BAR_COLOR} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
