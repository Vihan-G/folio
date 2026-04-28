# folio

**Paste your portfolio. Get brutally honest AI analysis.**

No login. No broker connection. No dashboard bloat. You drop a list of holdings
in any format — messy is fine — and folio tells you exactly what's wrong with it:
concentration risk, sector overexposure, volatility profile, correlation traps,
and a plain-English rebalance suggestion.

The insight is the product. Not the tracker, not the chart — the honest take.

![Screenshot placeholder](./public/screenshot.png)

## How it works

1. Paste holdings in any format — `AAPL 50 shares @ $145`, `BTC 0.5`, `Tesla $3000 worth`, anything.
2. `/api/parse` sends the raw text to Claude, which returns a structured `Holding[]` with sector, asset class, and approximate weight.
3. `/api/analyze` sends the structured portfolio back to Claude, which returns a typed `Analysis` with an overall score, a punchy headline, five severity-tagged sections, sector breakdown, and top holdings.
4. The page renders the score, donut + sector charts, and analysis cards.

Both API responses are validated with Zod before they leave the server.

## Tech stack

- **Next.js 16** (App Router, Turbopack, TypeScript)
- **Tailwind CSS v4**
- **Claude** via [`@anthropic-ai/sdk`](https://www.npmjs.com/package/@anthropic-ai/sdk) — model `claude-sonnet-4-6`
- **Recharts** for the allocation donut and sector bar
- **Zod** for runtime validation of model output
- **Vercel** for hosting

No database. No auth. No external financial data API.

## Local setup

```bash
npm install
echo 'ANTHROPIC_API_KEY=sk-ant-...' > .env.local
npm run dev
```

Open `http://localhost:3000`.

## Deploy

The repo is wired to Vercel — pushes to `main` deploy automatically.
Set `ANTHROPIC_API_KEY` in **Vercel → Settings → Environment Variables** for production.

```bash
vercel --prod
```

## Caveats

- Prices and weights are estimated by the model from training-time knowledge. They may be stale or wrong.
- Not financial advice. Use folio as a second opinion, not a trading signal.

## License

MIT
