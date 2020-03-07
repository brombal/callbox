import {Index} from "@app/db";

export enum NewOwnerStatus {
  NONE = 0,
  PENDING_OWNER_CONFIRMATION = 1,
}

export default interface Account {
  account: string;		          // the callbox account number
  owner: string;              // the account owner phone number
  newOwner: string;
  newOwnerStatus: NewOwnerStatus;
  allowed: string[];          // additional numbers
  openUntil: Date;
}

export const accountIndexes: Index[] = [
  { collection: 'accounts', index: 'account', options: { unique: true } },
];
