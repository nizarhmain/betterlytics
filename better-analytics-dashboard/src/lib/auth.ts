import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"
import { env } from "./env"
import prisma from "@/lib/postgres"

interface User {
  id: string
  name: string
  email: string
  role: string
  dashboardId: string;
  siteId: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
    dashboardId?: string;
    siteId?: string;
  }
  interface JWT {
    role?: string;
    dashboardId?: string;
    siteId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        const adminUsername = env.ADMIN_USERNAME
        const adminPassword = env.ADMIN_PASSWORD

        if (!adminUsername || !adminPassword) {
          throw new Error("Admin credentials not configured")
        }

        if (
          credentials?.username === adminUsername &&
          credentials?.password === adminPassword
        ) {

          try {
            const dashboard = await prisma.dashboard.upsert({
              where: { siteId: env.SITE_ID },
              update: {},
              create: {
                siteId: env.SITE_ID,
              },
            });

            return {
              id: "1",
              name: "Admin",
              email: "admin@localhost",
              role: "admin",
              dashboardId: dashboard.id,
              siteId: dashboard.siteId,
            }
          } catch (error) {
            console.error("Error upserting dashboard during authorization:", error);
            return null;
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as User).role
        token.dashboardId = (user as User).dashboardId;
        token.siteId = (user as User).siteId;
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      session.dashboardId = token.dashboardId as string;
      session.siteId = token.siteId as string;
      return session
    },
  },
} 