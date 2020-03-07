import Account from "@app/models/account";
import {accounts} from "@app/db";

export async function getAccountIfOwner(account: string, owner: string): Promise<Account> {
  return await accounts().findOne({ account, owner });
}

export async function getAccountIfAllowed(account: string, allowed: string): Promise<Account> {
  return await accounts().findOne({ account, $or: [ { owner: allowed }, { allowed } ] });
}
