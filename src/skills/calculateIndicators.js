import { RSI, EMA } from "technicalindicators";

export default async (data) => {
  const closes = data.map(d => d.close);

  const rsi = RSI.calculate({ values: closes, period: 14 });
  const ema20 = EMA.calculate({ values: closes, period: 20 });
  const ema50 = EMA.calculate({ values: closes, period: 50 });

  return {
    rsi: rsi.slice(-1)[0],
    ema20: ema20.slice(-1)[0],
    ema50: ema50.slice(-1)[0],
    price: closes.slice(-1)[0]
  };
};