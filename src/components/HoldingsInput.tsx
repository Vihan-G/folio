"use client";

import { useState } from "react";

const EXAMPLE = `AAPL 50 shares @ $145
NVDA 20
BTC 0.5
VOO 30 shares
Tesla $3000 worth
Reliance 100`;

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  errorMessage?: string | null;
};

export function HoldingsInput({
  value,
  onChange,
  onSubmit,
  disabled,
  errorMessage,
}: Props) {
  const [showHint, setShowHint] = useState(false);

  return (
    <section className="w-full">
      <label
        htmlFor="holdings-input"
        className="block text-sm font-medium text-zinc-700 mb-2"
      >
        Paste your holdings
      </label>

      <textarea
        id="holdings-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={EXAMPLE}
        disabled={disabled}
        rows={9}
        className="w-full min-h-[200px] resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed font-mono text-sm leading-6"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <button
            type="button"
            onClick={() => onChange(EXAMPLE)}
            disabled={disabled}
            className="text-zinc-600 hover:text-zinc-900 underline underline-offset-2 disabled:opacity-50"
          >
            Use example
          </button>
          <button
            type="button"
            onClick={() => setShowHint((s) => !s)}
            className="text-zinc-600 hover:text-zinc-900 underline underline-offset-2"
          >
            {showHint ? "Hide format tips" : "Format tips"}
          </button>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || value.trim().length === 0}
          className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {disabled ? "Analyzing…" : "Analyze portfolio"}
        </button>
      </div>

      {showHint && (
        <p className="mt-3 text-sm text-zinc-600 leading-6">
          One holding per line. Tickers, names, share counts, dollar amounts —
          any combination works. Examples:{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
            AAPL 50
          </code>
          ,{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
            Tesla $3000 worth
          </code>
          ,{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
            BTC 0.5
          </code>
          .
        </p>
      )}

      {errorMessage && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}
    </section>
  );
}
