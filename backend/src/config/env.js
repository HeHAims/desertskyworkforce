import dotenv from 'dotenv';

dotenv.config();

const toBoolean = (value, fallback = false) => {
  if (typeof value !== 'string') {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 8080),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ?? '',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ?? '',
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER ?? '',
  defaultRecipient: process.env.NOTIFICATION_TARGET_NUMBER ?? '+14428882240',
  allowSeedWrite: toBoolean(process.env.ALLOW_SEED_WRITE, true)
};

export const hasTwilioCredentials = () =>
  Boolean(env.twilioAccountSid && env.twilioAuthToken && env.twilioPhoneNumber);
