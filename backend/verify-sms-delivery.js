import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Twilio from 'twilio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const requiredEnv = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN'];
const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required env in backend/.env: ${missing.join(', ')}`);
  process.exit(1);
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const TARGET_RECIPIENT = '+14428882240';

if (!/^[+][1-9]\d{7,14}$/.test(TARGET_RECIPIENT)) {
  console.error('TARGET_RECIPIENT must be a valid E.164 phone number.');
  process.exit(1);
}

const client = Twilio(accountSid, authToken);

const neon = {
  reset: '\x1b[0m',
  brightBlack: '\x1b[90m',
  neonGreenBgBlackText: '\x1b[48;5;46m\x1b[30m',
  yellowBgBlackText: '\x1b[48;5;226m\x1b[30m',
  redBgBlackText: '\x1b[48;5;196m\x1b[30m'
};

const printMsg = (m) => {
  const sent = m.dateSent ?? m.dateCreated ?? null;
  const ts = sent ? new Date(sent).toISOString() : 'n/a';
  console.log(`- Message SID : ${m.sid}`);
  console.log(`  Sent At     : ${ts}`);
  console.log(`  Status      : ${m.status ?? 'n/a'}`);
  console.log(`  Error Code  : ${m.errorCode ?? 'n/a'}`);
  console.log(`  Price       : ${m.price ?? 'n/a'} ${m.priceUnit ?? ''}`.trim());
  console.log('');
};

const run = async () => {
  try {
    // fetch account metadata (best-effort)
    let account = null;
    try {
      account = await client.api.accounts(accountSid).fetch();
    } catch (e) {
      // ignore; account fetch is best-effort
    }

    // Retrieve last outbound messages to the target recipient
    const messages = await client.messages.list({ to: TARGET_RECIPIENT, limit: 10 });

    if (!messages || messages.length === 0) {
      console.log(`No messages found for recipient ${TARGET_RECIPIENT}.`);
      process.exit(0);
    }

    // Sort by dateSent or dateCreated descending and take last 3
    messages.sort((a, b) => {
      const ta = new Date(a.dateSent ?? a.dateCreated ?? 0).getTime();
      const tb = new Date(b.dateSent ?? b.dateCreated ?? 0).getTime();
      return tb - ta;
    });

    const recent = messages.slice(0, 3);

    console.log(`Found ${messages.length} messages to ${TARGET_RECIPIENT}. Showing latest ${recent.length}:\n`);

    recent.forEach(printMsg);

    const anyDelivered = recent.some((m) => String(m.status).toLowerCase() === 'delivered');
    const anyFailed = recent.some((m) => String(m.status).toLowerCase() === 'failed' || m.errorCode);

    // Detect likely trial account via friendlyName or status fields (best-effort)
    const accountLooksTrial = account && ((account.friendlyName && /trial/i.test(account.friendlyName)) || (account.status && /trial/i.test(account.status)));

    if (anyDelivered) {
      console.log('\n' + neon.neonGreenBgBlackText + ' ✅ At least one recent message is DELIVERED to ' + TARGET_RECIPIENT + ' ' + neon.reset + '\n');
    } else if (accountLooksTrial || anyFailed) {
      console.log('\n' + neon.yellowBgBlackText + ' ⚠️  No recent deliveries detected. This may be due to Trial account restrictions.' + neon.reset);
      console.log(neon.yellowBgBlackText + ` Please add ${TARGET_RECIPIENT} to Verified Caller IDs in the Twilio Console or upgrade the account.` + neon.reset + '\n');
    } else {
      console.log('\n' + neon.redBgBlackText + ' ℹ️  No deliveries detected in the last messages to the target. Review Twilio Console for details.' + neon.reset + '\n');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error while fetching Twilio messages:', err.message ?? err);
    process.exit(2);
  }
};

run();
