import * as _ from 'lodash';
import { codes } from "@app/db";
import Code from "@app/models/code";
import moment = require("moment");
import * as random from 'random-js';
const timestring = require('timestring');
const humanizeDuration = require('humanize-duration');

export default async function code(to: string, from: string, args: string[], message: string): Promise<string> {
  /*
  Possible formats:
  - code
    - create a new random code
  - code 123
    - "Code 123 will expire in [expiration]."
  - code 123 3 days
    - "Code 123 will expire in [expiration]."
    - invalid duration: "Don't understand"
   */

  let code: string = args[1];
  let codeProvided: boolean = !!code;
  let codeExists: Code = null;
  let durationSecs: number = 0;
  let durationProvided: boolean = false;

  const account: string = to;
  const user: string = from;

  // They gave a code, so create or update it
  if (codeProvided)
  {
    if (parseInt(code).toString() !== code)
      return "Sorry, I didn't understand that. To set a door code, send 'code [digits] [duration]'";

    if (code.length !== 3)
      return "Door codes must be 3 digits.";

    codeExists = await codes().findOne({ account, code }) as Code;

    durationProvided = (args.length >= 3);

    // They provided a duration, so use that
    if (durationProvided)
    {
      const durationInputStr = _.drop(args, 2).join(' ');
      try {
        durationSecs = timestring(durationInputStr);
      } catch {}

      if (!durationSecs)
        return "Sorry, I didn't understand that. To set a door code, send 'code [digits] [duration]'";
    }
    // They didn't provide a duration, so expire in 24 hours
    else
    {
      if (codeExists)
        durationSecs = Math.round((codeExists.expires.getTime() - Date.now()) / 1000);
      else
        durationSecs = timestring('24 hours');
    }
  }

  // They didn't provide a code, so generate a new one and expire it in 24 hours
  else
  {
    do {
      code = random.integer(100, 999).toString();
    } while (await codes().count({ account, code }) > 0);

    durationSecs = timestring('24 hours');
  }

  const codeDoc: Code = {
    account,
    createdBy: user,
    code,
    expires: moment().add(durationSecs, 'seconds').toDate()
  };

  if (codeExists)
  {
    if (durationProvided)
      await codes().replaceOne({account, createdBy: user, code}, codeDoc);
    // If they didn't provide a duration, we'll just tell them when it expires
  }
  else
    await codes().insertOne(codeDoc);

  let durationStr: string = humanizeDuration(durationSecs * 1000);

  if (codeProvided)
    return `Code ${code} will expire in ${durationStr}.`;
  else
    return `${code} is your new door code. It will expire in ${durationStr}. You may reply with something like "code ${code} 30 days" to change the code's expiration.`;
}
