import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "../(auth_routes)/login/action";
import getExpiryFromJWT, { refreshAccessToken } from "@/lib/refreshToken";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@email.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await loginUser({
            email: credentials.email,
            password: credentials.password,
          });

          const { tokens, user, newUser, redirectUrl } = res;
          if (!tokens || !user) return null;

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            roles: user.roles,
            newUser,
            redirectUrl,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            profileUrl: user.profileUrl,
            expiryDate: user.expiryDate,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },

  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user) {
        return {
          ...token,
          firstName: session.user.firstName,
          lastName: session.user.lastName,
          profileUrl: session.user.profileUrl,
        };
      }

      if (user && user.accessToken) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.profileUrl = user.profileUrl;
        token.role = user.role;
        token.roles = user.roles;
        token.newUser = user.newUser;
        token.redirectUrl = user.redirectUrl;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = getExpiryFromJWT(user.accessToken);
        token.expiryDate = user.expiryDate;
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Token expired – attempt refresh
      // If there's no refresh token, we can't refresh
      if (!token.refreshToken) {
        return { ...token, error: "RefreshAccessTokenError" };
      }
      console.log("refresh token being sent:", token.refreshToken);

      try {
        const refreshedToken = await refreshAccessToken(token);

        // If refresh succeeded (has accessToken), return updated token
        if (refreshedToken?.accessToken) {
          return {
            ...token,
            accessToken: refreshedToken.accessToken,
            refreshToken: refreshedToken.refreshToken,
            accessTokenExpires: refreshedToken.accessTokenExpires, // already computed
          };
        }

        // If refresh failed but returned an error token, propagate it
        return {
          ...token,
          error: refreshedToken?.error || "RefreshAccessTokenError",
        };
      } catch (error) {
        console.error("Unexpected error during token refresh", error);
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id!;
        session.user.email = token.email ?? undefined;
        session.user.firstName = token.firstName!;
        session.user.lastName = token.lastName!;
        session.user.role = token.role!;
        session.user.roles = token.roles;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.accessTokenExpires = token.accessTokenExpires;
        session.user.newUser = token.newUser;
        session.user.profileUrl = token.profileUrl;
        session.user.expiryDate = token.expiryDate;
        session.error = token.error ?? null;

        if (token.newUser) {
          session.user.redirectUrl = token.redirectUrl;
        }
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
