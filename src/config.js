import dotenv from "dotenv";
dotenv.config();

export default {
  symbol: process.env.SYMBOL || "BTCUSDT",
  interval: process.env.INTERVAL || "1m",
  confidenceThreshold: Number(process.env.CONFIDENCE_THRESHOLD) || 70,
  stopLossPercent: Number(process.env.STOP_LOSS_PERCENT) || 2, // 2% stop loss
  takeProfitPercent: Number(process.env.TAKE_PROFIT_PERCENT) || 5, // 5% take profit
  dcaTriggerPercent: Number(process.env.DCA_TRIGGER_PERCENT) || 1, // 1% drop triggers DCA
  maxDcaCount: Number(process.env.MAX_DCA_COUNT) || 5 // Maximum 5 DCA additions
};