import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { type AuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { prisma } from "@/lib/prisma" // Correct named import

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/signin",
    error: "/auth/auth-error",
  },
  secret: process.env.NEXTAUTH_SECRET,
}