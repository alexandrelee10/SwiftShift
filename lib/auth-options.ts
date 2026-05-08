import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import  prisma  from "@/lib/prisma";
import { signInSchema } from "@/lib/validations/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        // 1. Validate input (Zod)
        const parsed = signInSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        // 2. Find user in DB
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        // 3. Compare password
        const validPassword = await bcrypt.compare(
          password,
          user.password
        );

        if (!validPassword) {
          return null;
        }

        // 4. Return user (this becomes session data)
        return {
          id: user.id,
          email: user.email,
          name: user.firstName,
          role: user.role
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = user.role;
    }

    return token;
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
    }

    return session;
  },
},

  pages: {
    signIn: "/sign-in",
  },
};