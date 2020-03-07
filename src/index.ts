require('dotenv').config();
const moduleAlias = require('module-alias');
moduleAlias.addAlias('@app', __dirname);

import 'source-map-support/register';
import * as express from 'express';
import twiml from '@app/routes/twiml';
import sms from '@app/routes/sms';
import * as bodyParser from 'body-parser';
import { connect } from "@app/db";

const app = express();

app.set('etag', false);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(twiml);
app.use(sms);
app.get('/', (req: express.Request, res: express.Response) => res.send('Hello World!'));

(async () => {
  await connect();
  app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}!`));
})();

