/* eslint-disable no-unused-vars */
import { DefaultSession, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

type UserId = string;

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: UserId;
    } & DefaultSession['user'];
  }
}
