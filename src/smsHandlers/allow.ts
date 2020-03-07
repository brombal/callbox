import * as _ from 'lodash';
import {accounts} from "@app/db";
import Account from '@app/models/account';
import validator from 'validator';
import { getAccountIfOwner } from "@app/util/getAccount";

export default async function allow(to: string, from: string, args: string[], message: string): Promise<string> {
  const account: Account = await getAccountIfOwner(to, from);
  if (!account)
    return `Sorry, you aren't allowed to do that.`;

  let allowed: string = _.drop(args, 1).join().replace(/[^\d]/, '');
  if (!validator.isMobilePhone(allowed, 'en-US')) {
    return `Sorry, I don't recognize that phone number.`;
  }

  if (allowed.substr(0, 2) !== '+1')
    allowed = `+1${allowed}`;

  if (account.allowed.some(a => a === allowed))
    return `The number ${allowed} already has permission to create door codes.`;

  if (account.owner === allowed)
    return `The number ${allowed} is already the owner of this account.`;

  await accounts().updateOne({ account: to, owner: from }, { $addToSet: { allowed }});

  return `The number ${allowed} has been given permission to create door codes.`;
}
