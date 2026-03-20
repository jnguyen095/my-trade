import axios from "axios";

export default async (symbol, interval = "1m") => {
  const res = await axios.get(
    "https://api.binance.com/api/v3/klines",
    {
      params: {
        symbol,
        interval,
        limit: 100
      }
    }
  );

  return res.data.map(candle => ({
    open: Number(candle[1]),
    high: Number(candle[2]),
    low: Number(candle[3]),
    close: Number(candle[4]),
    volume: Number(candle[5])
  }));
};