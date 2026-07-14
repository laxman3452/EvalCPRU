import type { NextAuthConfig } from 'next-auth';
import type { NextRequest } from 'next/server';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request }: { auth: any, request: NextRequest }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      // Allow login page
      if (pathname.startsWith('/login')) return true;

      // All other routes require auth
      return isLoggedIn;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  providers: [],
} satisfies NextAuthConfig;
