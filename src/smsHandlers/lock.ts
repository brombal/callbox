import { accounts } from "@app/db";
import Account from "@app/models/account";
import { getAccountIfOwner } from "@app/util/getAccount";

export default async function unlock(to: string, from: string, args: string[], message: string): Promise<string> {
  const account: Account = await getAccountIfOwner(to, from);
  if (!account)
    return `Sorry, you aren't allowed to do that.`;

  await accounts().updateOne({ account: to, owner: from }, { $set: { openUntil: null }});

  return `Door is locked.`;
}
