import {codes} from "@app/db";
import Code from "@app/models/code";
import {Cursor} from "mongodb";
import * as moment from 'moment';
const humanizeDuration = require('humanize-duration');

export default async function list(to: string, from: string, args: string[], message: string): Promise<string> {
  const f: Cursor = codes().find({ account: to, expires: { $gte: new Date() } });
  const list = await f.toArray();

  let response = list
    .map((code: Code) => {
      const durationMs = code.expires.getTime() - Date.now();
      const durationSec = durationMs / 1000;
      const durationMin = durationSec / 60;
      const durationMinRound = Math.ceil(durationMin);
      return `- Code ${code.code} expires in ${humanizeDuration(durationMinRound * 60 * 1000)}.`;
    })
    .join('\n');

  if (!response) {
    response = 'You don\'t have any door codes. Send something like "code 123 1 hour" to create a door code.';
  }

  return response;
}
