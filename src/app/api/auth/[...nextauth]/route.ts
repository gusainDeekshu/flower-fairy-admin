// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    // 1. Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // 2. NestJS Backend Login
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          },
        );
        const data = await res.json();
        if (res.ok && data.user?.role === "ADMIN") {
          return { ...data.user, accessToken: data.access_token };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // src/app/api/auth/[...nextauth]/route.ts
async signIn({ user, account }) {
  if (account?.provider === "google") {
    try {
      // Points to the new /users/check-admin endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/check-admin?email=${user.email}`);
      const data = await res.json();
      
      // AccessDenied is thrown if this returns false
      return data.isAdmin === true;
    } catch (error) {
      console.error("Connection to backend failed:", error);
      return false;
    }
  }
  return true;
},
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role || "ADMIN";
        token.accessToken = (user as any).accessToken || account?.id_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
