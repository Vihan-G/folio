import type { ScoreLabel } from "@/lib/types";

type Props = {
  score: number;
  label: ScoreLabel;
  headline: string;
};

function scoreColors(score: number) {
  if (score >= 75) {
    return {
      ring: "ring-green-500/30",
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
    };
  }
  if (score >= 50) {
    return {
      ring: "ring-amber-500/30",
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
    };
  }
  return {
    ring: "ring-red-500/30",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  };
}

export function ScoreBadge({ score, label, headline }: Props) {
  const c = scoreColors(score);
  const clamped = Math.max(0, Math.min(100, Math.round(score)));

  return (
    <section className="flex flex-col sm:flex-row sm:items-center gap-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div
        className={`shrink-0 flex h-24 w-24 items-center justify-center rounded-full ring-8 ${c.ring} ${c.bg}`}
        aria-label={`Score ${clamped} out of 100`}
      >
        <div className={`text-3xl font-semibold tabular-nums ${c.text}`}>
          {clamped}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${c.bg} ${c.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
          {label}
        </div>
        <h2 className="mt-2 text-lg sm:text-xl font-semibold leading-snug text-zinc-900">
          {headline}
        </h2>
      </div>
    </section>
  );
}
