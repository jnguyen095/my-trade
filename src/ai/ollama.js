import axios from "axios";

const normalizeDecision = (value) => {
  if (typeof value !== "string") return "HOLD";
  const v = value.trim().toUpperCase();
  if (v === "BUY" || v === "SELL" || v === "HOLD") return v;
  return "HOLD";
};

const normalizeConfidence = (value) => {
  let num = Number(value);
  if (!Number.isFinite(num) || num < 0) return 0;
  if (num > 100) return 100;
  return Math.round(num * 100) / 100;
};

const normalizeReason = (value) => {
  if (value === undefined || value === null) return "No reason provided";
  const reason = String(value).trim();
  return reason.length ? reason : "No reason provided";
};

const parseResponse = (raw) => {
  let text = raw;

  if (typeof text !== "string") {
    text = JSON.stringify(text);
  }

  // strip code fences
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  let data = null;

  try {
    data = JSON.parse(text);
  } catch {
    // fallback: crude extraction by key patterns
    const decisionMatch = text.match(/"?decision"?\s*:\s*"?(BUY|SELL|HOLD)"?/i);
    const confidenceMatch = text.match(/"?confidence"?\s*:\s*"?([0-9]+(?:\.[0-9]+)?)"?/i);
    const reasonMatch = text.match(/"?reason"?\s*:\s*"?([^"]+)"?/i);

    return {
      decision: normalizeDecision(decisionMatch?.[1] || "HOLD"),
      confidence: normalizeConfidence(confidenceMatch?.[1] ?? 0),
      reason: normalizeReason(reasonMatch?.[1] || "No reason provided")
    };
  }

  if (!data || typeof data !== "object") {
    return { decision: "HOLD", confidence: 0 , reason: "Invalid AI response" };
  }

  return {
    decision: normalizeDecision(data.decision),
    confidence: normalizeConfidence(data.confidence),
    reason: normalizeReason(data.reason)
  };
};

export const askAI = async (prompt) => {
  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "llama3",
    prompt,
    stream: false
  });

  try {
    const parsed = parseResponse(res.data.response);
    // console.log("AI Response:", res.data.response, "-> parsed", parsed);
    return parsed;
  } catch (e)  {
    console.error("Failed to parse AI response:", e);
    return { decision: "HOLD", confidence: 0 , reason: "Invalid AI response"};
  }
};