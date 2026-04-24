"use client";

import { useAuthStore } from "@/store/authstore";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface Props {
  children: ReactNode;
}

function AuthInit() {
  const { data: session, status } = useSession();
  const setUser = useAuthStore((s) => s.setUser);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setLoading = useAuthStore((s) => s.setLoading);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }

    setLoading(false);

    if (status === "authenticated" && session?.user) {
      setUser(session.user);
      setAccessToken(session.user.accessToken ?? null);
    }

    if (session?.error === "RefreshAccessTokenError") {
      signOut({ redirect: false }); // clear NextAuth session
      setAccessToken(null);
      router.push("/login");
    }

    if (status === "unauthenticated") {
      setUser(null);
      router.replace("/login");
    }
  }, [status, session, setUser, setLoading, setAccessToken, router]);

  return null;
}

export default function AuthSession({ children }: Props) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={true}>
      <AuthInit />
      {children}
    </SessionProvider>
  );
}
