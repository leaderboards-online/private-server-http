import { config } from 'dotenv';
config({ path: './src/.env' });
export const {
  PORT,
  AUTH0_AUDIENCE,
  AUTH0_DOMAIN,
  MONGO_URI,
  CLIENT_ORIGIN_URL,
} = process.env;
