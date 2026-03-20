import { getAccount, updateAccount } from "./account.js";

const FEE = 0.001; // 0.1%

export const executePaperTrade = (decision, price) => {
  const account = getAccount();

  let { balance, position } = account;

  // --- OPEN POSITION ---
  if (!position && decision.decision === "BUY") {
    const amount = balance * 0.1; // dùng 10% vốn

    const qty = amount / price;

    account.position = {
      side: "LONG",
      entryPrice: price,
      qty,
      value: amount
    };

    account.balance -= amount * (1 + FEE);

    console.log("Opened LONG:", account.position);
  }

  // --- CLOSE POSITION ---
  else if (position && decision.decision === "SELL") {
    const pnl =
      (price - position.entryPrice) * position.qty;

    account.balance += position.value + pnl;

    account.history.push({
      entry: position.entryPrice,
      exit: price,
      pnl,
      time: new Date().toISOString()
    });

    console.log("Closed position. PnL:", pnl);

    account.position = null;
  }

  updateAccount(account);

  return account;
};