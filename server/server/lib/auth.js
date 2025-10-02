"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const plugins_1 = require("better-auth/plugins");
// If your Prisma file is located elsewhere, you can change the path
const prisma_2 = require("@workspace/db/generated/prisma");
const prisma = new prisma_2.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, prisma_1.prismaAdapter)(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        (0, plugins_1.organization)({
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
    trustedOrigins: ["http://localhost:5173"],
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
