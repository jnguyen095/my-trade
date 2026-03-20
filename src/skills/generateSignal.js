export default async ({ rsi, ema20, ema50 }) => {
  if (rsi < 30 && ema20 > ema50) {
    return "BUY";
  } else  if (rsi > 70 && ema20 < ema50) {
      return "SELL";
  } else {
      return "HOLD";
  }
        
};
