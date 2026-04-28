"use client";

import { useState } from "react";
import { AllocationChart } from "@/components/AllocationChart";
import { AnalysisCard } from "@/components/AnalysisCard";
import { Disclaimer } from "@/components/Disclaimer";
import { HoldingsInput } from "@/components/HoldingsInput";
import { LoadingState } from "@/components/LoadingState";
import { ScoreBadge } from "@/components/ScoreBadge";
import { SectorChart } from "@/components/SectorChart";
import type { Analysis, Holding } from "@/lib/types";

type Stage = "idle" | "parsing" | "analyzing" | "done" | "error";

export default function Home() {
  const [rawText, setRawText] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [holdings, setHoldings] = useState<Holding[] | null>(null);

  const isBusy = stage === "parsing" || stage === "analyzing";

  async function runAnalysis() {
    if (rawText.trim().length === 0) return;
    setErrorMessage(null);
    setAnalysis(null);
    setHoldings(null);

    setStage("parsing");
    let parsedHoldings: Holding[];
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });
      const data = await safeJson(res);
      if (!res.ok) {
        const msg =
          (typeof data.error === "string" && data.error) ||
          "We couldn't read those holdings. Try one per line.";
        throw new Error(msg);
      }
      parsedHoldings = data.holdings as Holding[];
    } catch (err) {
      setStage("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to parse holdings.",
      );
      return;
    }

    setHoldings(parsedHoldings);
    setStage("analyzing");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holdings: parsedHoldings }),
      });
      const data = await safeJson(res);
      if (!res.ok) {
        const msg =
          (typeof data.error === "string" && data.error) ||
          "Analysis failed. Try again with simpler input.";
        throw new Error(msg);
      }
      setAnalysis(data.analysis as Analysis);
      setStage("done");
    } catch (err) {
      setStage("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to analyze portfolio.",
      );
    }
  }

  function reset() {
    setStage("idle");
    setAnalysis(null);
    setHoldings(null);
    setErrorMessage(null);
  }

  return (
    <main className="mx-auto flex w-full max-w-[860px] flex-1 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
          folio
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900">
          Paste your portfolio. Get a brutally honest read.
        </h1>
        <p className="mt-3 max-w-prose text-base leading-7 text-zinc-600">
          No login, no broker connection. Drop your holdings in any messy
          format and folio tells you what&rsquo;s actually wrong with it —
          concentration, sector tilt, correlation traps, and a plain-English
          rebalance suggestion.
        </p>
      </header>

      <HoldingsInput
        value={rawText}
        onChange={setRawText}
        onSubmit={runAnalysis}
        disabled={isBusy}
        errorMessage={stage === "error" ? errorMessage : null}
      />

      {isBusy && (
        <LoadingState stage={stage === "parsing" ? "parsing" : "analyzing"} />
      )}

      {stage === "done" && analysis && (
        <Results
          analysis={analysis}
          parsedHoldingsCount={holdings?.length ?? 0}
          onReset={reset}
        />
      )}

      <footer className="mt-auto border-t border-zinc-200 pt-6">
        <Disclaimer />
      </footer>
    </main>
  );
}

function Results({
  analysis,
  parsedHoldingsCount,
  onReset,
}: {
  analysis: Analysis;
  parsedHoldingsCount: number;
  onReset: () => void;
}) {
  return (
    <section className="flex flex-col gap-6">
      <ScoreBadge
        score={analysis.overallScore}
        label={analysis.scoreLabel}
        headline={analysis.headline}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AllocationChart topHoldings={analysis.topHoldings} />
        <SectorChart sectorBreakdown={analysis.sectorBreakdown} />
      </div>

      <div className="flex flex-col gap-4">
        {analysis.sections.map((section, idx) => (
          <AnalysisCard key={`${section.title}-${idx}`} section={section} />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 text-xs text-zinc-500">
        <span>
          Parsed {parsedHoldingsCount} holding
          {parsedHoldingsCount === 1 ? "" : "s"}.
        </span>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-zinc-700 hover:bg-zinc-50"
        >
          Start over
        </button>
      </div>
    </section>
  );
}

type JsonObject = { [k: string]: unknown };

async function safeJson(res: Response): Promise<JsonObject> {
  try {
    const json = await res.json();
    return typeof json === "object" && json !== null ? (json as JsonObject) : {};
  } catch {
    return {};
  }
}
