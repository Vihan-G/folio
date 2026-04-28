import type { AnalysisSection, Severity } from "@/lib/types";

const SEVERITY_STYLES: Record<
  Severity,
  { bg: string; text: string; ring: string; chipLabel: string }
> = {
  high: {
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-200",
    chipLabel: "High",
  },
  medium: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    chipLabel: "Medium",
  },
  low: {
    bg: "bg-green-50",
    text: "text-green-700",
    ring: "ring-green-200",
    chipLabel: "Low",
  },
  info: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
    chipLabel: "Info",
  },
};

export function AnalysisCard({ section }: { section: AnalysisSection }) {
  const s = SEVERITY_STYLES[section.severity];

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <header className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-900">
          {section.title}
        </h3>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${s.bg} ${s.text} ${s.ring}`}
        >
          {s.chipLabel}
        </span>
      </header>
      <p className="mt-2 text-sm leading-6 text-zinc-700 whitespace-pre-wrap">
        {section.body}
      </p>
    </article>
  );
}
