import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plataforma White Label Food",
  description: "Gerada com Next.js e Three.js",
};

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const resolvedParams = await params;
  const tenantSlug = resolvedParams.tenant;

  return (
    <html lang="pt-BR" data-theme={tenantSlug} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const stored = JSON.parse(localStorage.getItem('food-cart-storage') || '{}');
              if (stored.state?.theme === 'dark') {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {}
          `
        }} />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-secondary`}>
        {children}
      </body>
    </html>
  );
}