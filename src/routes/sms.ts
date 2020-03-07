import * as express from 'express';
import handleSms from "@app/smsHandlers";
import validator from 'validator';
import {getAccountIfAllowed} from "@app/util/getAccount";

const twilio = require('twilio');
const router = express.Router();

router.post('/sms', async (req: express.Request, res: express.Response) => {

  const twiml = new twilio.twiml.MessagingResponse();
  res.contentType('text/xml');

  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (process.env.NODE_ENV !== 'dev' && req.body.Token !== authToken) {
    // Validate Twilio request
    const url = process.env.TWILIO_AUTH_CALLBACK_URL;
    const params = req.body;
    const twilioSignature = req.header('X-Twilio-Signature');
    const validated = twilio.validateRequest(authToken, twilioSignature, url, params);

    if (!validated) {
      twiml.message('Invalid request.');
      res.send(twiml.toString());
      return;
    }
  }

  // Get and send response from callbox app sms handler

  const to = req.body.To;
  const from = req.body.From;
  const body = req.body.Body;

  if (!validator.isMobilePhone(from, "en-US") || !validator.isMobilePhone(to, "en-US") || !body) {
    twiml.message('Invalid phone.');
    res.send(twiml.toString());
    return;
  }

  let response: string;

  if (!await getAccountIfAllowed(to, from))
    response = "Sorry, you aren't allowed to do that.";
  else
    response = await handleSms(to, from, body);

  if (response) {
    twiml.message(response);
  } else {
    twiml.message('The request ' + JSON.stringify(req.body) + ' did not generate a response.');
  }

  res.send(twiml.toString());
});

export default router;

