import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const requiredEnvVars = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'];
const missingVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingVars.length > 0) {
  console.error(`Missing required environment variables in backend/.env: ${missingVars.join(', ')}`);
  process.exit(1);
}

if (!/^AC[a-zA-Z0-9]{30,}$/.test(process.env.TWILIO_ACCOUNT_SID)) {
  console.error('TWILIO_ACCOUNT_SID must be a real Twilio SID that starts with AC.');
  process.exit(1);
}

if (!process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_AUTH_TOKEN.trim().length < 10) {
  console.error('TWILIO_AUTH_TOKEN must be a real Twilio auth token.');
  process.exit(1);
}

if (!/^\+?[1-9]\d{7,14}$/.test(process.env.TWILIO_PHONE_NUMBER)) {
  console.error('TWILIO_PHONE_NUMBER must be a real E.164-formatted phone number.');
  process.exit(1);
}

const expectedBody = '[Despacho desertsky]: Nueva tarea operativa de hito creada. Monitoreando logs de telemetría.';
const TARGET_RECIPIENT = '+14428882240';

if (!/^[+][1-9]\d{7,14}$/.test(TARGET_RECIPIENT)) {
  console.error('Recipient phone number must be provided in E.164 format.');
  process.exit(1);
}

const mockDispatchTask = {
  task: {
    id: 'task-test-emergency-fleet-inspection-8705',
    name: 'Emergency Fleet Inspection - Unit #8705',
    title: {
      en: 'Emergency Fleet Inspection - Unit #8705',
      es: 'Inspección de flota de emergencia - Unidad #8705'
    },
    progress: 0,
    status: 'todo',
    milestone: 'M1: Clearinghouse Cleared',
    summary: {
      en: 'Emergency fleet inspection task queued for immediate dispatch notification.',
      es: 'Tarea de inspección de flota de emergencia en cola para notificación inmediata de despacho.'
    },
    carrier: 'desertsky',
    route: 'LOCAL-SIM',
    subtasks: []
  },
  locale: 'es'
};

const candidateBaseUrls = (() => {
  if (process.env.BACKEND_URL) {
    return [process.env.BACKEND_URL];
  }

  const ports = [process.env.PORT, process.env.BACKEND_PORT, '3000', '8080']
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);

  return ports.map((port) => `http://localhost:${port}`);
})();

const fetchImpl = globalThis.fetch;

if (typeof fetchImpl !== 'function') {
  console.error('Native fetch is not available in this Node runtime. Use Node.js 18 or newer.');
  process.exit(1);
}

const postNotify = async (baseUrl) => {
  const response = await fetchImpl(`${baseUrl}/api/notify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // Force Spanish locale and rely on backend to route to the primary dispatch line
    body: JSON.stringify({ task: mockDispatchTask.task, locale: 'es' })
  });

  const responseText = await response.text();
  let data = null;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(`Backend response from ${baseUrl} was not valid JSON: ${responseText}`);
  }

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status} from ${baseUrl}: ${JSON.stringify(data)}`);
  }

  return { data, baseUrl };
};

let lastError = null;

for (const baseUrl of candidateBaseUrls) {
  try {
    const { data, baseUrl: matchedBaseUrl } = await postNotify(baseUrl);
    const notification = data?.notification;

    if (!notification?.sid) {
      throw new Error('Twilio Message SID was not returned by the backend.');
    }

    if (notification.to !== TARGET_RECIPIENT) {
      throw new Error(`Expected SMS recipient ${TARGET_RECIPIENT}, received ${notification.to ?? 'undefined'}.`);
    }

    if (typeof notification.body !== 'string' || !notification.body.includes(expectedBody)) {
      throw new Error('The returned message body did not include the expected Spanish Twilio payload.');
    }

    const success = `Verified task creation and Twilio SMS routing via ${matchedBaseUrl}`;
    // Neon green block for high-visibility success
    console.log('\n\x1b[48;5;46m\x1b[30m###############################################\x1b[0m');
    console.log(`\x1b[48;5;46m\x1b[30m ${success.padEnd(41)} \x1b[0m`);
    console.log(`\x1b[48;5;46m\x1b[30m Twilio Message SID: ${notification.sid} \x1b[0m`);
    console.log('\x1b[48;5;46m\x1b[30m###############################################\x1b[0m\n');
    process.exit(0);
  } catch (error) {
    lastError = error;
  }
}

console.error(`Unable to verify the backend notify pipeline on any candidate port. Last error: ${lastError?.message ?? 'unknown error'}`);
process.exit(1);
