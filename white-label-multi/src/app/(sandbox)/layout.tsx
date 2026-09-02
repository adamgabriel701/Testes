import { Inter } from "next/font/google";
import "../(tenants)/[tenant]/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function SandboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      {/* Estilo base para a página de testes */}
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --primary-color: #2563eb;
            --secondary-color: #1f2937;
            --bg-color: #f9fafb;
            --surface-color: #ffffff;
            --muted-color: #6b7280;
          }
          :root.dark {
            --primary-color: #3b82f6;
            --secondary-color: #f9fafb;
            --bg-color: #121212;
            --surface-color: #1e1e1e;
            --muted-color: #9ca3af;
          }
        `
      }} />
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
      {children}
    </div>
  );
}