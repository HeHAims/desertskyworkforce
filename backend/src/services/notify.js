import { getTwilioClient } from '../config/twilioClient.js';
import { env } from '../config/env.js';
import { buildNotificationBody } from './i18n.js';

// Absolute owner phone line enforced for all outbound notifications.
const TARGET_RECIPIENT = '+14428882240';

export const sendNotification = async ({ task, locale }) => {
  const client = getTwilioClient();
  const body = buildNotificationBody({ task, locale });
  const to = TARGET_RECIPIENT;

  const message = await client.messages.create({
    from: env.twilioPhoneNumber,
    to,
    body
  });

  return {
    sid: message.sid,
    to,
    from: env.twilioPhoneNumber,
    body
  };
};
