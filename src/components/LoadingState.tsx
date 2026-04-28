type Props = {
  stage: "parsing" | "analyzing";
};

export function LoadingState({ stage }: Props) {
  const message =
    stage === "parsing"
      ? "Reading your holdings…"
      : "Running the analysis…";

  const sub =
    stage === "parsing"
      ? "Extracting tickers, sectors, and approximate weights."
      : "Looking for concentration, sector tilt, and correlation traps.";

  return (
    <section
      aria-live="polite"
      className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-400 opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-zinc-700" />
        </span>
        <p className="text-sm font-medium text-zinc-900">{message}</p>
      </div>
      <p className="mt-2 text-sm text-zinc-600">{sub}</p>

      <div className="mt-5 space-y-3">
        <SkeletonRow widthPct={92} />
        <SkeletonRow widthPct={78} />
        <SkeletonRow widthPct={64} />
      </div>
    </section>
  );
}

function SkeletonRow({ widthPct }: { widthPct: number }) {
  return (
    <div className="h-4 overflow-hidden rounded-md bg-zinc-100">
      <div
        className="h-full animate-pulse rounded-md bg-zinc-200"
        style={{ width: `${widthPct}%` }}
      />
    </div>
  );
}
