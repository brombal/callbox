import * as express from "express";
import { accounts, codes } from "@app/db";
import Account from "@app/models/account";
import * as moment from "moment";
import sendSms from "@app/twilio/sendSms";
import Code from "@app/models/code";
const twilio = require("twilio");
const router = express.Router();

function buildGather(attempt: number): any {
  return {
    input: "dtmf",
    action: "/twiml?try=" + attempt,
    method: "POST",
    timeout: 30,
    numDigits: 3,
  };
}

router.post("/twiml", async (req: express.Request, res: express.Response) => {
  // Get and send response from callbox app sms handler
  const twiml = new twilio.twiml.VoiceResponse();

  const to = req.body.To;

  const account = (await accounts().findOne({ account: to })) as Account;
  let doorOpened = false;
  let code: Code = undefined;

  if (!account) {
    twiml.hangup();
  } else if (account.openUntil && moment().isBefore(account.openUntil)) {
    await new Promise((accept) => setTimeout(accept, 2000));
    twiml.play({ digits: 9 });
    doorOpened = true;
  } else {
    const digits = req.body.Digits;
    const audio =
      "https://b38387ea75adf9d37a6b-c0e93865eab410f6c73530a9026429c9.ssl.cf1.rackcdn.com/DontForget8kbps.wav";

    if (!digits) {
      await new Promise((accept) => setTimeout(accept, 2000));
      const gather = twiml.gather(buildGather(1));
      gather.play(audio, { loop: 0 });
    } else {
      code = (await codes().findOne({
        account: to,
        code: digits,
        expires: { $gte: new Date() },
      })) as Code;
      const attempt = parseInt(req.query.try as any) || 1;

      if (code) {
        twiml.play({ digits: 9 });
        doorOpened = true;
      } else if (attempt < 3) {
        const gather = twiml.gather(buildGather(attempt + 1));
        gather.play(audio, { loop: 0 });
      }
    }
  }

  res.contentType("text/xml");
  res.send(twiml.toString());

  if (doorOpened) {
    await sendSms(
      account.owner,
      account.account,
      `The door was opened (` + (code ? `with code ${code.code}` : "door is unlocked") + ")"
    );
  }
});

export default router;
