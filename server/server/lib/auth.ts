import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@workspace/db/generated/prisma";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true
  },
  plugins: [
    organization({
      schema: {
        organization: {
          additionalFields: {
            address: {
              type: "string",
              required: false
            }
          }
        }
      }
    })
  ],
  trustedOrigins: ['https://restaurant.singh3y.dev', 'http://localhost:5173'],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "ADMIN",
        input: false
      }
    }
  }
});