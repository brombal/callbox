
export default async function help(to: string, from: string, args: string[], message: string): Promise<string> {
  let response = `You can text me the following commands:
  
- code - Creates a new random door code.
- code [code] [duration] - Creates a door code with the given duration. If the code exists, it will update the code's duration.
- remove [code] - Removes the given door code.
- list - Lists all the currently active door codes.
- lock - Locks door.
- unlock - Displays door lock status.
- unlock [duration] - Unlocks door for specified duration
- report - Replies with a report of the last 30 days of door code entry activity.
- allow [number] - Allows a phone number to create door codes.
- deny [number] - Prevents a phone number from creating door codes.
- owner [number] - Set a new number as the owner of this callbox account.
- help - Show this help menu.`;

  if (args[0] !== 'help' && message) {
    response = `Sorry, I don't know what "${message}" means.
    
${response}`;
  }

  return response;
}
