import { getAccount, updateAccount } from "./account.js";
import config from "../config.js";

const FEE = 0.001; // 0.1%

// =======================
// OPEN LONG
// =======================
const openLong = (account, price, decision) => {
  const amount = account.balance * 0.1; // dùng 10% vốn

  const qty = amount / price;

  account.position = {
    side: "LONG",
    entryPrice: price,
    reason: decision.reason,
    qty,
    value: amount,
    stopLoss: price * (1 - config.stopLossPercent / 100), // Stop loss price
    takeProfit: price * (1 + config.takeProfitPercent / 100), // Take profit price
    dcaCount: 0, // Number of DCA additions
    totalInvested: amount, // Total amount invested including DCA
    averageEntryPrice: price // Average entry price (for DCA calculations)
  };

  account.balance -= amount * (1 + FEE);

  console.log("Opened LONG:", account.position);
};

// =======================
// CLOSE POSITION
// =======================
const closePosition = (account, price, decision) => {
  const pnl = (price - account.position.averageEntryPrice) * account.position.qty;

  account.balance += account.position.totalInvested + pnl;

  account.history.push({
    side: account.position.side,
    entry: account.position.averageEntryPrice,
    exit: price,
    reason: decision.reason,
    pnl,
    dcaCount: account.position.dcaCount,
    time: new Date().toISOString()
  });

  console.log("Closed position. PnL:", pnl);

  account.position = null;
};

// =======================
// DCA (Dollar Cost Averaging)
// =======================
const executeDCA = (account, price) => {
  const position = account.position;

  // Check if price has dropped 1% from original entry price (not average) and we haven't reached max DCA
  const priceDropPercent = ((position.entryPrice - price) / position.entryPrice) * 100;

  if (priceDropPercent >= config.dcaTriggerPercent && position.dcaCount < config.maxDcaCount) {
    // Calculate DCA amount (same as initial position size)
    const dcaAmount = position.value / (position.dcaCount + 1); // Scale down for multiple DCAs
    const dcaWithFee = dcaAmount * (1 + FEE);

    // Check if balance is positive and enough for DCA
    if (account.balance <= 0 || account.balance < dcaWithFee) {
      console.log(`Insufficient or zero balance to execute DCA. Required: ${dcaWithFee.toFixed(2)}, Available: ${account.balance.toFixed(2)}`);
      return false;
    }

    const dcaQty = dcaAmount / price;

    // Update position with DCA
    const newTotalInvested = position.totalInvested + dcaAmount;
    const newTotalQty = position.qty + dcaQty;
    const newAverageEntryPrice = (position.averageEntryPrice * position.qty + price * dcaQty) / newTotalQty;

    position.qty = newTotalQty;
    position.totalInvested = newTotalInvested;
    position.averageEntryPrice = newAverageEntryPrice;
    position.dcaCount += 1;

    // Recalculate SL/TP based on new average entry price
    position.stopLoss = newAverageEntryPrice * (1 - config.stopLossPercent / 100);
    position.takeProfit = newAverageEntryPrice * (1 + config.takeProfitPercent / 100);

    // Deduct DCA amount from balance
    account.balance -= dcaWithFee;

    console.log(`DCA executed at ${price}. Price dropped ${priceDropPercent.toFixed(2)}% from original entry ${position.entryPrice}. New average entry: ${newAverageEntryPrice.toFixed(2)}, DCA count: ${position.dcaCount}`);
    console.log("Updated position:", position);

    return true;
  }

  return false;
};

// =======================
// CHECK STOP LOSS / TAKE PROFIT
// =======================
const checkStopLossTakeProfit = (account, price) => {
  if (!account.position) return false;

  const position = account.position;

  // For LONG positions
  if (position.side === "LONG") {
    // Check for DCA opportunity first
    if (executeDCA(account, price)) {
      return true; // DCA was executed, skip SL/TP check
    }

    // Check Stop Loss
    if (price <= position.stopLoss) {
      console.log(`Stop Loss hit at ${price}, closing position`);
      closePosition(account, price, { reason: "Stop Loss" });
      return true;
    }
    // Check Take Profit
    else if (price >= position.takeProfit) {
      console.log(`Take Profit hit at ${price}, closing position`);
      closePosition(account, price, { reason: "Take Profit" });
      return true;
    }
  }

  return false;
};

export const executePaperTrade = (decision, price) => {
  const account = getAccount();
  let { position } = account;

  // --- CHECK STOP LOSS / TAKE PROFIT FIRST ---
  if (position && checkStopLossTakeProfit(account, price)) {
    // Position was closed by SL/TP, no need to check decision
  }
  // --- OPEN POSITION ---
  else if (!position && decision.decision === "BUY") {
    openLong(account, price, decision);
  }
  // --- CLOSE POSITION ---
  else if (position && decision.decision === "SELL") {
    closePosition(account, price, decision);
  }

  updateAccount(account);

  return account;
};