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
const body = '[Despacho desertsky]: Nueva tarea operativa de hito creada. Monitoreando logs de telemetría.';

if (!/^AC[0-9a-fA-F]{30,}$/.test(accountSid)) {
  console.error('TWILIO_ACCOUNT_SID does not look valid (must start with AC).');
  process.exit(1);
}

const client = Twilio(accountSid, authToken);

const neonGreen = '\x1b[48;5;46m\x1b[30m';
const reset = '\x1b[0m';

const run = async () => {
  try {
    const msg = await client.messages.create({ from, to, body });

    console.log('\n' + neonGreen + '###############################################' + reset);
    console.log(neonGreen + ` Sent SMS to ${to}`.padEnd(47) + reset);
    console.log(neonGreen + ` Message SID: ${msg.sid}`.padEnd(47) + reset);
    console.log(neonGreen + '###############################################' + reset + '\n');
    process.exit(0);
  } catch (err) {
    // Twilio trial accounts often return HTTP 400/403 or specific error codes
    const message = err?.message || String(err);
    console.error('Failed to send SMS:', message);
    if (/trial/i.test(message) || /not a verified number/i.test(message) || /account.*trial/i.test(message)) {
      console.error('\nTrial-account note: please add the destination number to Verified Caller IDs in the Twilio Console or upgrade the account.');
    }
    process.exit(2);
  }
};

run();
