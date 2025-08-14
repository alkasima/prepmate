import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Demo user
        if (credentials.email === "demo@prepmate.com" && credentials.password === "password123") {
          return {
            id: "demo-user-id",
            email: "demo@prepmate.com",
            name: "Demo User",
            image: null,
          }
        }

        // For demo purposes, accept any email/password combination
        // In production, verify against real database
        if (credentials.email && credentials.password) {
          return {
            id: "user-" + Date.now(),
            email: credentials.email,
            name: credentials.email.split('@')[0],
            image: null,
          }
        }

        return null
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    // Note: NextAuth PagesOptions does not include `signUp`. Custom signup flow should be implemented in your app and linked from the sign-in page.
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development", // Enable debug logs in development
}