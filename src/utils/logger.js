import fs from "fs";

export const log = (data) => {
  const line = JSON.stringify({
    time: new Date().toISOString(),
    ...data
  }) + "\n";

  fs.appendFileSync("trade.log", line);
};