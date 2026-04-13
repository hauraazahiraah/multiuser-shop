import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("Email not registered");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Wrong password");
        }

        // ✅ PASTIKAN ROLE DALAM FORMAT LOWERCASE
        const userRole = (user.role || 'user').toLowerCase();
        
        console.log("🔐 LOGIN SUCCESS:", { 
          email: user.email, 
          role: userRole 
        });

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: userRole, // ← FORMAT LOWERCASE
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // ← LOWERCASE
        console.log("🎫 JWT TOKEN SET:", { id: token.id, role: token.role });
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role; // ← LOWERCASE
        console.log("🍪 SESSION SET:", { id: session.user.id, role: session.user.role });
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  // TAMBAHKAN INI UNTUK DEBUG
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };