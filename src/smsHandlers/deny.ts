import * as _ from 'lodash';
import {accounts} from "@app/db";
import Account from '@app/models/account';
import validator from 'validator';

export default async function deny(to: string, from: string, args: string[], message: string): Promise<string> {
  const account: Account = await accounts().findOne({ account: to, owner: from });

  if (!account) {
    return 'Sorry, you are not permitted to do this.';
  }

  let allowed: string = _.drop(args, 1).join().replace(/[^+\d]/, '');
  if (!validator.isMobilePhone(allowed, 'en-US')) {
    return `Sorry, I don't recognize that phone number.`;
  }

  if (allowed.substr(0, 2) !== '+1')
    allowed = `+1${allowed}`;

  if (account.owner === allowed)
    return `The number ${allowed} is the owner of this account, and cannot be removed.`;

  if (!account.allowed.some(a => a === allowed))
    return "Sorry, I don't recognize that phone number.";

  await accounts().updateOne({ account: to, owner: from }, { $pull: { allowed }});

  return `Okay, the number ${allowed} is no longer allowed to create door codes.`;
}
