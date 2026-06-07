import twilio from 'twilio';
import { env, hasTwilioCredentials } from './env.js';

let cachedClient = null;

export const getTwilioClient = () => {
  if (!hasTwilioCredentials()) {
    throw new Error('Twilio credentials are not configured.');
  }

  if (!cachedClient) {
    cachedClient = twilio(env.twilioAccountSid, env.twilioAuthToken);
  }

  return cachedClient;
};
