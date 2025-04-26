import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"
import { env } from "./env"

interface User {
  id: string
  name: string
  email: string
  role: string
}

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
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
        // For now, we'll use a single admin user from environment variables
        const adminUsername = env.ADMIN_USERNAME
        const adminPassword = env.ADMIN_PASSWORD

        if (!adminUsername || !adminPassword) {
          throw new Error("Admin credentials not configured")
        }

        if (
          credentials?.username === adminUsername &&
          credentials?.password === adminPassword
        ) {
          return {
            id: "1",
            name: "Admin",
            email: "admin@localhost",
            role: "admin",
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
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.role = token.role as string
      }
      return session
    },
  },
} 