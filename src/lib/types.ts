import { z } from "zod";

export const HoldingSchema = z.object({
  ticker: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().nullable(),
  sector: z.string().min(1),
  assetClass: z.enum([
    "equity",
    "crypto",
    "etf",
    "commodity",
    "fixed_income",
    "other",
  ]),
  approxCurrentPrice: z.number().nullable(),
  approxWeight: z.number().min(0).max(1),
});

export const HoldingsArraySchema = z.array(HoldingSchema).min(1);

export const SeveritySchema = z.enum(["high", "medium", "low", "info"]);

export const AnalysisSectionSchema = z.object({
  title: z.string().min(1),
  severity: SeveritySchema,
  body: z.string().min(1),
});

export const SectorWeightSchema = z.object({
  sector: z.string().min(1),
  weight: z.number().min(0).max(1),
});

export const TopHoldingSchema = z.object({
  ticker: z.string().min(1),
  weight: z.number().min(0).max(1),
});

export const ScoreLabelSchema = z.enum([
  "Concentrated",
  "Balanced",
  "Diversified",
  "Risky",
  "Conservative",
]);

export const AnalysisSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  scoreLabel: ScoreLabelSchema,
  headline: z.string().min(1),
  sections: z.array(AnalysisSectionSchema).min(1),
  sectorBreakdown: z.array(SectorWeightSchema).min(1),
  topHoldings: z.array(TopHoldingSchema).min(1),
});

export type Holding = z.infer<typeof HoldingSchema>;
export type Severity = z.infer<typeof SeveritySchema>;
export type AnalysisSection = z.infer<typeof AnalysisSectionSchema>;
export type SectorWeight = z.infer<typeof SectorWeightSchema>;
export type TopHolding = z.infer<typeof TopHoldingSchema>;
export type ScoreLabel = z.infer<typeof ScoreLabelSchema>;
export type Analysis = z.infer<typeof AnalysisSchema>;

export const ParseRequestSchema = z.object({
  rawText: z.string().min(1).max(10_000),
});

export const AnalyzeRequestSchema = z.object({
  holdings: HoldingsArraySchema,
});
