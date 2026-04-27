import AuthSession from "@/components/AuthSession";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthSession>{children}</AuthSession>
    </>
  );
}
