import { PrismaClient } from '@workspace/db/generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'
import express from 'express'
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { enhance } from '@workspace/db';
import { ZenStackMiddleware } from '@zenstackhq/server/express'
import { auth } from "./lib/auth";
import cors from 'cors'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
}).$extends(withAccelerate())

const app = express()

// // Trust proxy for accurate IP addresses
// app.set('trust proxy', true)

// // Morgan HTTP request logger
// app.use(morgan('combined', { stream: loggerStream }))

// // Custom request/response logger
// app.use(requestLogger)

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}))

// Auth routes with error handling
app.all("/api/auth/*splat", toNodeHandler(auth))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ZenStack middleware with error handling
app.use(
    '/api/model',
    ZenStackMiddleware({
      // getSessionUser extracts the current session user from the request, its
      // implementation depends on your auth solution
      getPrisma: async (request) => {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(request.headers),
        });
        //@ts-ignore
        return enhance(
          prisma, 
          {
            //@ts-ignore
            user: session ? session.user : undefined
          }
        )
      }
    }),
);

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: https://github.com/prisma/prisma-examples/blob/latest/orm/express/README.md#using-the-rest-api`),
)
