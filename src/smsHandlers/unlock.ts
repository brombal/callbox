import { accounts } from "@app/db";
import * as moment from 'moment';
import Account from "@app/models/account";
import { getAccountIfOwner } from "@app/util/getAccount";
import * as _ from "lodash";
const humanizeDuration = require('humanize-duration');
const timestring = require('timestring');

export default async function unlock(to: string, from: string, args: string[], message: string): Promise<string> {
  const account: Account = await getAccountIfOwner(to, from);
  if (!account)
    return `Sorry, you aren't allowed to do that.`;

  if (args[1]) {
    let durationSecs: number = 0;
    const durationInputStr = _.drop(args, 1).join(' ');
    try {
      durationSecs = timestring(durationInputStr);
    } catch {}

    if (!durationSecs)
      return "Sorry, I didn't understand that. To unlock the door, send 'unlock [duration]'";

    await accounts().updateOne({ account: to, owner: from }, { $set: { openUntil: moment().add(durationSecs, 'seconds').toDate() }});

    return `Door is unlocked for ${humanizeDuration(durationSecs * 1000)}.`;
  } else {
    return moment(account.openUntil).diff(moment()) > 0
      ? `Door is unlocked for ${humanizeDuration(Math.round(moment().diff(account.openUntil) / 60000) * 60000)}.`
      : "Door is locked. To unlock, specify a duration, e.g.: 'lock 1 hour'"
  }
}
