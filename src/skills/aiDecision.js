import { askAI } from "../ai/ollama.js";

export default async (input) => {
  const prompt = `
You are a crypto scalper (1m timeframe).

RSI: ${input.rsi}
EMA20: ${input.ema20}
EMA50: ${input.ema50}
Signal: ${input.signal}

Should we trade?

Return JSON:
{
  "decision": "BUY or SELL or HOLD",
  "confidence": number (0-100),
  "reason": "short"
}
`;

  return await askAI(prompt);
};