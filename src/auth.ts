import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import mongoose from 'mongoose';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || 'cognicraft_secret_key_2026_super_secure_jwt_key_32_chars',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5000',
  database: mongodbAdapter(mongoose.connection.db as any),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: '7d',
      },
    }),
  ],
});
