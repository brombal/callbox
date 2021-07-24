import { Index } from "@app/db";

export default class Code {
  code: string;
  account: string; // the callbox number
  createdBy: string;
  expires: Date;
}

export const codeIndexes: Index[] = [
  { collection: "codes", index: { account: 1, code: 1 } },
  {
    collection: "codes",
    index: { account: 1, createdBy: 1, code: 1 },
    options: { unique: true },
  },
  {
    collection: "codes",
    index: { expires: 1 },
    options: { expireAfterSeconds: 0 },
  },
];
