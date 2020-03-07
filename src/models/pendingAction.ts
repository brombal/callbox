import { Index } from "@app/db";

export default interface PendingAction {
  phone: string;
  keyword: string;
  action: string;
  expires: Date;
}

export const pendingActionIndexes: Index[] = [
  { collection: 'pendingActions', index: 'phone' },
  { collection: 'pendingActions', index: 'expires', options: { expireAfterSeconds: 0 } },
];
