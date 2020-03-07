import {Index} from "@app/db";

export default class History {
  account: string;            // callbox account phone number
  code: string;
  caller: string;
  date: number;
  expires: number;
}

export const historyIndexes: Index[] = [
  { collection: 'history', index: 'account' },
  { collection: 'history', index: { expires: 1 }, options: { expireAfterSeconds: 0 } },
];
