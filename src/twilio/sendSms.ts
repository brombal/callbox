import * as twilio from 'twilio';

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// require the Twilio module and create a REST client
const client = new twilio.Twilio(accountSid, authToken);

export default async function sendSms(to: string, from: string, message: string): Promise<any> {
  try {
    return await client.messages
      .create({
        to: to,
        from: from,
        body: message,
      });
  } catch {
    return null;
  }
}