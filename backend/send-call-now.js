import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Twilio from 'twilio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const REQUIRED = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'];
const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('Missing required env in backend/.env:', missing.join(', '));
  process.exit(1);
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_PHONE_NUMBER;
const to = '+14428882240';

const client = Twilio(accountSid, authToken);

const messageText = 'Despacho desertsky: Nueva tarea operativa recibida. Por favor confirme recepción.';
const twimlet = `http://twimlets.com/message?Message%5B0%5D=${encodeURIComponent(messageText)}`;

const neon = '\x1b[48;5;46m\x1b[30m';
const reset = '\x1b[0m';

const run = async () => {
  try {
    const call = await client.calls.create({ to, from, url: twimlet });

    console.log('\n' + neon + '###############################################' + reset);
    console.log(neon + ` Placed call to ${to}`.padEnd(47) + reset);
    console.log(neon + ` Call SID: ${call.sid}`.padEnd(47) + reset);
    console.log(neon + '###############################################' + reset + '\n');
    process.exit(0);
  } catch (err) {
    console.error('Failed to place call:', err.message || err);
    if (err && err.code) console.error('Twilio error code:', err.code);
    if (/trial/i.test(err?.message) || /not a verified number/i.test(err?.message)) {
      console.error('Trial account note: add the destination number to Verified Caller IDs or upgrade your Twilio account.');
    }
    process.exit(2);
  }
};

run();
