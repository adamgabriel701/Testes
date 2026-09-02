import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getTenantConfig } from '@/lib/tenants';
import AppShell from '@/components/ui/AppShell';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plataforma Multi-nicho",
  description: "White Label SaaS",
};

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const resolvedParams = await params;
  const config = getTenantConfig(resolvedParams.tenant);

  const themeStyle = `
    :root {
      --primary-color: ${config.theme.primary};
      --secondary-color: ${config.theme.secondary};
      --bg-color: ${config.theme.bg};
      --surface-color: ${config.theme.surface};
    }
  `;

  return (
    <html lang="pt-BR" data-theme={config.slug} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const stored = JSON.parse(localStorage.getItem('multi-tenant-cart') || '{}');
              if (stored.state?.theme === 'dark') {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {}
          `
        }} />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-secondary`}>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}