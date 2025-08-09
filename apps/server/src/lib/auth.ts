// apps/server/src/lib/auth.ts 

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma/index.js";
 
const prisma = new PrismaClient();


export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET, // <- ADD THIS LINE
  database: prismaAdapter(prisma, {
    provider: "sqlite", // Since we are using SQLite...right ?
  }),
  trustedOrigins: [
    process.env.CORS_ORIGIN || "",
  ],
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days got this part from gpt. review
    updateAge: 60 * 60 * 24, // 1 day
  },
});
