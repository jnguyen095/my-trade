import dotenv from "dotenv";
dotenv.config();

export default {
  symbol: process.env.SYMBOL || "BTCUSDT",
  interval: process.env.INTERVAL || "1m",
  confidenceThreshold: Number(process.env.CONFIDENCE_THRESHOLD) || 70
};