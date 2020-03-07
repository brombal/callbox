import { codes } from "@app/db";
import Code from "@app/models/code";

export default async function remove(to: string, from: string, args: string[], message: string): Promise<string> {
  let code: string = args[1];
  const codeExists: Code = await codes().findOne({ account: to, code }) as Code;

  if (!codeExists) {
    return `Code ${code} does not exist.`;
  }

  const deleted = await codes().deleteOne({ account: to, code });
  if (deleted.deletedCount === 1) {
    return `Code ${code} has been deleted.`;
  }
  return JSON.stringify(deleted);
}
