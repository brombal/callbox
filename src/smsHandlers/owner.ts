import validator from 'validator';
import Account from '@app/models/account';
import { getAccountIfOwner } from "@app/util/getAccount";
import * as _ from 'lodash';
import { NewOwnerStatus } from "@app/models/account";
import sendSms from "@app/twilio/sendSms";

export default async function owner(to: string, from: string, args: string[], message: string): Promise<string> {
  let newOwner = _.drop(args, 1).join();

  const account: Account = await getAccountIfOwner(to, from);
  if (!account)
    return `Sorry, you aren't allowed to do that.`;

  if (!newOwner || !validator.isMobilePhone(newOwner, 'en-US'))
    return `Sorry, I didn't understand that. To set a new owner for this account, send "owner [number]".`;

  if (newOwner.substr(0, 2) !== '+1')
    newOwner = `+1${newOwner}`;

  const formattedNewOwner = `(${newOwner.substr(2, 3)}) ${newOwner.substr(5, 3)}-${newOwner.substr(8, 4)}`;

  if (account.newOwnerStatus === NewOwnerStatus.PENDING_OWNER_CONFIRMATION)
  {
  }
  else
  {
    await sendSms(newOwner, account.account, `Hello, your phone number ${formattedNewOwner} has been set as the owner for a callbox account. Do you accept? Reply "yes" or "no".`);
    return `Are you sure you want to set ${formattedNewOwner} as the new owner for this callbox account? Reply "yes" or "no".`;
  }
}
