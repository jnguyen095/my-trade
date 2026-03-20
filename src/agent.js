import getMarketData from "./skills/getMarketData.js";
import calculateIndicators from "./skills/calculateIndicators.js";
import generateSignal from "./skills/generateSignal.js";
import aiDecision from "./skills/aiDecision.js";
import executeTrade from "./skills/executeTrade.js";
import cron from "node-cron";
import config from "./config.js";
import { log } from "./utils/logger.js";

const run = async () => {
  const market = await getMarketData("BTCUSDT");
  const indicators = await calculateIndicators(market);
  const signal = await generateSignal(indicators);

  const decision = await aiDecision({
    ...indicators,
    signal
  });

  console.log("AI Decision:", decision);

  if (decision.confidence > config.confidenceThreshold) {
    await executeTrade(decision, indicators.price);
  }

  log({
      symbol: config.symbol,
      signal,
      ...decision
    });
};

cron.schedule("*/1 * * * *", async () => {
  console.log("Running bot...");
  await run();
});

run();