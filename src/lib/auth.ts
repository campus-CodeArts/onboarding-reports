import NextAuth, { type DefaultSession } from "next-auth"
import "next-auth/jwt"
import { authOptions } from '@/lib/authOptions';

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    /**
     * Role in the application
     */
    role: string,
    /**
     * By default, TypeScript merges new interface properties and overwrites existing ones.
     * In this case, the default session user properties will be overwritten,
     * with the new ones defined above. To keep the default session user properties,
     * you need to add them back into the newly declared interface.
     */
    user: DefaultSession["user"]
  }
}

export const handler = NextAuth(authOptions);

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...handler,
    secret: process.env.NEXTAUTH_SECRET,
    basePath: "/auth",
    experimental: { enableWebAuthn: true },
    debug: !!process.env.AUTH_DEBUG,
    session: { strategy: "jwt" },
})

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}