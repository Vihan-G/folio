import { NextResponse } from "next/server";
import {
  ANALYSIS_MODEL,
  extractText,
  getAnthropicClient,
  stripJsonFences,
} from "@/lib/anthropic";
import { ANALYZE_SYSTEM_PROMPT } from "@/lib/prompts";
import { AnalysisSchema, AnalyzeRequestSchema } from "@/lib/types";

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

  const parsed = AnalyzeRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const userMessage = JSON.stringify({ holdings: parsed.data.holdings });

  let raw: string;
  try {
    const anthropic = getAnthropicClient();
    const completion = await anthropic.messages.create({
      model: ANALYSIS_MODEL,
      max_tokens: 3000,
      system: ANALYZE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });
    raw = stripJsonFences(extractText(completion));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upstream failure";
    return NextResponse.json(
      { error: `Analyze model call failed: ${message}` },
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

  const validated = AnalysisSchema.safeParse(json);
  if (!validated.success) {
    return NextResponse.json(
      {
        error: "Model output failed schema validation",
        issues: validated.error.flatten(),
      },
      { status: 422 },
    );
  }

  return NextResponse.json({ analysis: validated.data });
}
