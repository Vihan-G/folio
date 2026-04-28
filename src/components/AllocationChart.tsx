"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { TopHolding } from "@/lib/types";

const PALETTE = [
  "#0f172a",
  "#1e3a8a",
  "#0e7490",
  "#15803d",
  "#a16207",
  "#9a3412",
  "#7c2d12",
  "#6b21a8",
  "#525252",
];

type ChartDatum = {
  name: string;
  value: number;
};

const TOP_N = 8;

export function AllocationChart({ topHoldings }: { topHoldings: TopHolding[] }) {
  const data = buildData(topHoldings);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-900">Allocation</h3>
      <p className="mt-1 text-xs text-zinc-500">
        Top {Math.min(TOP_N, topHoldings.length)} holdings
        {topHoldings.length > TOP_N ? " plus the rest grouped" : ""}.
      </p>

      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={92}
              stroke="#ffffff"
              strokeWidth={2}
              paddingAngle={1}
              isAnimationActive={false}
            >
              {data.map((entry, idx) => (
                <Cell
                  key={entry.name}
                  fill={PALETTE[idx % PALETTE.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${(Number(value) * 100).toFixed(1)}%`,
                String(name),
              ]}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #e4e4e7",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-zinc-600">
        {data.map((d, idx) => (
          <li key={d.name} className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: PALETTE[idx % PALETTE.length] }}
            />
            <span className="truncate font-medium text-zinc-800">
              {d.name}
            </span>
            <span className="ml-auto tabular-nums text-zinc-500">
              {(d.value * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function buildData(holdings: TopHolding[]): ChartDatum[] {
  const sorted = [...holdings].sort((a, b) => b.weight - a.weight);
  if (sorted.length <= TOP_N) {
    return sorted.map((h) => ({ name: h.ticker, value: h.weight }));
  }
  const top = sorted.slice(0, TOP_N);
  const restWeight = sorted
    .slice(TOP_N)
    .reduce((sum, h) => sum + h.weight, 0);
  return [
    ...top.map((h) => ({ name: h.ticker, value: h.weight })),
    { name: "Other", value: restWeight },
  ];
}
