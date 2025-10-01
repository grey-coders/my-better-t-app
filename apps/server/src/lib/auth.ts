import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma/index.js";

const SEVEN_DAYS = 60 * 60 * 24 * 7
const ONE_DAY = 60 * 60 * 24
const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [
    process.env.CORS_ORIGIN || "",
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  session: {
    expiresIn: SEVEN_DAYS,
    updateAge: ONE_DAY ,
  },
});
