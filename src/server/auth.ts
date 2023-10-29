import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GithubProvider from 'next-auth/providers/github';
import { db } from './db/root';

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  adapter: DrizzleAdapter(db),
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
    verifyRequest: '/verify-request',
    newUser: '/register',
  },
  session: {
    strategy: 'database',
  },
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    GithubProvider({
      clientId: `${process.env.GITHUB_ID}`,
      clientSecret: `${process.env.GITHUB_SECRET}`,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
    redirect() {
      return '/';
    },
  },
  // events: {
  //   signIn(message) { console.log(message) },
  //   signOut(message) { console.log(message) },
  //   createUser(message) { console.log(message) },
  //   updateUser(message) { console.log(message) },
  //   linkAccount(message) { console.log(message) },
  //   session(message) { console.log(message)},
  // },
};
