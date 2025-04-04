import { compareSync } from 'bcrypt-ts-edge';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';

import { prisma } from '@/db/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const config = {
  pages: {
    signIn: '/zh/sign-in',
    error: '/zh/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 4 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // Find user in database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });
        // Check if user exists and password is correct
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );
          // If password is correct, return user object
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // If user doesn't exist or password is incorrect, return null
        return null;
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ auth, request }: any) {
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];
      // Get pathname from the req URL object
      const { pathname } = request.nextUrl;

      // Check if user is not authenticated and on a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;
      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger, session }: any) {
      // 首先检查用户是否仍然存在
      if (token.id) {
        const userExists = await prisma.user.findUnique({
          where: { id: token.id },
          select: { id: true, role: true },
        });

        if (!userExists) {
          // 用户已被删除，使令牌无效
          return {};
        }

        // 如果数据库角色与令牌不一致，更新令牌
        if (userExists && token.role !== userExists.role) {
          token.role = userExists.role; // 同步最新角色
        }
      }
      // Assign user fields to token
      if (user) {
        token.role = user.role;
        token.id = user.id;
        // If user has no name, use email as their default name
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];

          // Update the user in the database with the new name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }

      // Handle session updates (e.g., name change)
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
      }

      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token, trigger }: any) {
      // 如果token为空对象（用户被删除），返回空session
      if (Object.keys(token).length === 0) {
        return {};
      }
      // Map the token data to the session object
      session.user.id = token.id;
      session.user.name = token.name; // 👈 Add this line
      session.user.role = token.role; // 👈 Add this line

      // Optionally handle session updates (like name change)
      if (trigger === 'update' && token.name) {
        session.user.name = token.name;
      }

      // Return the updated session object
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
