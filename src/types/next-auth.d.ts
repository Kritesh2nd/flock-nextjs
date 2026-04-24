import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: string;
    roles: string[];
    newUser?: boolean;
    redirectUrl?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    profileUrl: string;
    expiryDate?: string;
    accessTokenExpires?: number;
  }

  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      phone?: string;
      email?: string;
      role: string;
      roles: string[];
      profileUrl: string;
      newUser?: boolean;
      redirectUrl?: string;
      accessToken?: string;
      refreshToken?: string;
      expiryDate?: string;
      error?: string | null;
      accessTokenExpires?: number;
    } & DefaultSession["user"];
    error?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string | null;
    role: string;
    roles: string[];
    newUser?: boolean;
    profileUrl: string;
    redirectUrl?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    expiryDate?: string;
    error?: string;
  }
}
