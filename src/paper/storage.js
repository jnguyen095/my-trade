import fs from "fs";

const FILE = "paper_account.json";

export const loadAccount = () => {
  if (!fs.existsSync(FILE)) {
    return {
      balance: 1000,
      position: null,
      history: []
    };
  }
  return JSON.parse(fs.readFileSync(FILE));
};

export const saveAccount = (data) => {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
};