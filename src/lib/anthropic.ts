import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

const configuredAnalysisModel = process.env.ANALYSIS_MODEL;
if (!configuredAnalysisModel) {
  throw new Error("ANALYSIS_MODEL is not configured");
}
export const ANALYSIS_MODEL = configuredAnalysisModel;

export function extractText(
  response: Awaited<ReturnType<Anthropic["messages"]["create"]>>,
): string {
  if ("content" in response && Array.isArray(response.content)) {
    return response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");
  }
  return "";
}

export function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }
  return trimmed;
}
