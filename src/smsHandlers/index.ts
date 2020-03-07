import * as _ from 'lodash';
import code from './code';
import remove from './remove';
import list from './list';
import report from './report';
import allow from './allow';
import deny from './deny';
import owner from './owner';
import help from './help';
import lock from './lock';
import unlock from './unlock';

type smsHandler = (to: string, from: string, args: string[], message: string) => Promise<string>;

const commands: { [cmd: string]: smsHandler } = {
  code,
  remove,
  list,
  report,
  allow,
  deny,
  owner,
  help,
  lock,
  unlock,
};

/**
 * Handles an incoming SMS.
 *
 * @param {string} to The number that received the sms (the callbox handler)
 * @param {string} from The number that sent the sms (the manager or permitted user)
 * @param {string} message The SMS command
 */
export default async function handleSms(to: string, from: string, message: string): Promise<string> {
  let parts: string[] = message.trim().split(' ');
  parts = _.filter(_.map(parts, p => p.trim()));
  parts[0] = parts[0].toLowerCase();

  let cmd: smsHandler;

  if (commands.hasOwnProperty(parts[0]))
  {
    cmd = commands[parts[0]];
  }
  else
  {
    cmd = help;
  }

  return cmd(to, from, parts, message);
}
