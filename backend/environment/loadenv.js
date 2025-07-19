// loadenv.js
import dotenv from 'dotenv';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function loadenv() {
  const env = process.env.NODE_ENV || 'development';
  const result = dotenv.config({
    path: path.resolve(__dirname,`.env.${env || "development"}` ),
  });

  if (result.error) {
    console.warn(`⚠️ Could not load .env.${env}`);
  } else {
    console.log(`✅ Loaded environment: ${env}`);
  }
};
