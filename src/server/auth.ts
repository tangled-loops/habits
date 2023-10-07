import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { eq, or } from 'drizzle-orm';
import { type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GithubProvider from 'next-auth/providers/github';

import { db } from '@/server/db/root';

import { users } from '~/db/schema';

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
    async session({ session, user, trigger }) {
      console.log(trigger);
      console.log(session);
      console.log(user);
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
  events: {
    //    /**
    //  * If using a `credentials` type auth, the user is the raw response from your
    //  * credential provider.
    //  * For other providers, you'll get the User object from your adapter, the account,
    //  * and an indicator if the user was new to your Adapter.
    //  */
    // signIn: (message: {
    //   user: User
    //   account: Account | null
    //   profile?: Profile
    //   isNewUser?: boolean
    // }) => Awaitable<void>
    // /**
    //  * The message object will contain one of these depending on
    //  * if you use JWT or database persisted sessions:
    //  * - `token`: The JWT token for this session.
    //  * - `session`: The session object from your adapter that is being ended.
    //  */
    // signOut: (message: { session: Session; token: JWT }) => Awaitable<void>
    // createUser: (message: { user: User }) => Awaitable<void>
    // updateUser: (message: { user: User }) => Awaitable<void>
    // linkAccount: (message: {
    //   user: User | AdapterUser
    //   account: Account
    //   profile: User | AdapterUser
    // }) => Awaitable<void>
    // /**
    //  * The message object will contain one of these depending on
    //  * if you use JWT or database persisted sessions:
    //  * - `token`: The JWT token for this session.
    //  * - `session`: The session object from your adapter.
    //  */
    // session: (message: { session: Session; token: JWT }) => Awaitable<void>
  },
};
