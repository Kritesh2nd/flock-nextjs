import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const refreshAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface JWTToken {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  error?: string;

  [key: string]: any;
}

let refreshPromise: Promise<JWTToken> | null = null;

/**
 * Refresh access token using GET
 * Safe for single-use refresh tokens
 */
export async function refreshAccessToken(token: JWTToken): Promise<JWTToken> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      if (!token.refreshToken) {
        throw new Error("Missing refresh token");
      }

      const response = await refreshAxios.post("/auth/refresh-tokens", {
        refreshToken: token.refreshToken,
      });

      const refreshed = response.data.tokens;

      const expiresAt = getExpiryFromJWT(refreshed.accessToken);

      return {
        ...token,
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken ?? token.refreshToken,
        accessTokenExpires: expiresAt, // ✅ from JWT
      };
    } catch (error) {
      console.error("RefreshAccessTokenError", error);
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export default function getExpiryFromJWT(accessToken: string): number {
  try {
    const [, payload] = accessToken.split(".");
    const decoded = JSON.parse(atob(payload));
    if (!decoded.exp) {
      throw new Error("No exp in JWT");
    }

    return decoded.exp * 1000; // ms
  } catch (e) {
    console.error("JWT decode failed", e);
    return Date.now() - 1; // force refresh
  }
}
