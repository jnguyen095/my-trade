import { loadAccount, saveAccount } from "./storage.js";

export const getAccount = () => loadAccount();

export const updateAccount = (account) => {
  saveAccount(account);
};