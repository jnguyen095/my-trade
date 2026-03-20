import { executePaperTrade } from "../paper/tradeEngine.js";

export default async (decision, price) => {
  console.log("=== PAPER TRADE ===");

  try {
    const account = executePaperTrade(decision, price);

    console.log("Balance:", account.balance);

    if (account.position) {
      console.log("Open Position:", account.position);
    }
  } catch (e) {
    console.error("Error executing paper trade:", e);
  };
}