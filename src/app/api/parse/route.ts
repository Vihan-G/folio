import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ANALYSIS_MODEL,
  extractText,
  getAnthropicClient,
  stripJsonFences,
} from "@/lib/anthropic";
import { PARSE_SYSTEM_PROMPT } from "@/lib/prompts";
import { HoldingsArraySchema, ParseRequestSchema } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = ParseRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  let raw: string;
  try {
    const anthropic = getAnthropicClient();
    const completion = await anthropic.messages.create({
      model: ANALYSIS_MODEL,
      max_tokens: 2000,
      system: PARSE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: parsed.data.rawText }],
    });
    raw = stripJsonFences(extractText(completion));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upstream failure";
    return NextResponse.json(
      { error: `Parse model call failed: ${message}` },
      { status: 502 },
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "Model did not return valid JSON" },
      { status: 422 },
    );
  }

  const validated = HoldingsArraySchema.safeParse(json);
  if (!validated.success) {
    return NextResponse.json(
      {
        error: "Model output failed schema validation",
        issues: validated.error.flatten(),
      },
      { status: 422 },
    );
  }

  const normalized = normalizeWeights(validated.data);
  return NextResponse.json({ holdings: normalized });
}

function normalizeWeights(
  holdings: z.infer<typeof HoldingsArraySchema>,
) {
  const total = holdings.reduce((sum, h) => sum + h.approxWeight, 0);
  if (total <= 0) return holdings;
  return holdings.map((h) => ({
    ...h,
    approxWeight: Number((h.approxWeight / total).toFixed(6)),
  }));
}
