import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi-nicho Platform",
  description: "White Label SaaS for E-commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}