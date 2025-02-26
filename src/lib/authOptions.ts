import NextAuth from 'next-auth';
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from 'next-auth/providers/google';
import fs from "fs";

export const authOptions = {
  providers: [
    GitHubProvider({
        clientId: process.env.AUTH_GITHUB_ID!,
        clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/spreadsheets.readonly",
        },
      },
    }),
  ],
  debug: true,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.role = await getUserRole(token);
        // console.log('JWT');
        // console.log(account);
      }
      // console.log('TOKEN');
      // console.log(token);
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.role = await getUserRole(session);
      // console.log('Session');
      // console.log(session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

async function getUserRole(container) {
    const user = container && container.user ? container.user: container;
    if (!user) return process.env.DEFAULT_ROLE || 'anonymous';

    if (user.email && user.email === 'adiaz@codeartssolutions.com') return 'admin';
    if (user.email && user.email.endsWith('@codeartssolutions.com')) return 'user';

    try {  
      const users = await JSON.parse(fs.readFileSync("public/data/users.json", "utf8"));
      const found = users.find((userEntry) => userEntry['Correo personal (gmail).'] === user.email);
      return found ? 'student' : process.env.DEFAULT_ROLE;
    } catch (error) {
      console.error(error);
    }

    return process.env.DEFAULT_ROLE;
}

export default NextAuth(authOptions);