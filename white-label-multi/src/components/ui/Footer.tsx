'use client';

import { motion } from 'framer-motion';

interface FooterProps {
  tenantName: string;
}

export default function Footer({ tenantName }: FooterProps) {
  return (
    <footer className="bg-surface border-t border-gray-100 dark:border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Coluna 1: Marca */}
        <div className="md:col-span-1">
          <h3 className="text-2xl font-extrabold text-primary tracking-tight">{tenantName}</h3>
          <p className="text-muted text-sm mt-2 leading-relaxed">
            Moda, estilo e qualidade para o seu dia a dia.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-muted hover:text-primary transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7c4.78-.75 8.44-4.9 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/></svg>
            </a>
            <a href="#" className="text-muted hover:text-primary transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3z"/></svg>
            </a>
          </div>
        </div>

        {/* Coluna 2: Atendimento */}
        <div>
          <h4 className="font-bold text-secondary mb-4 text-sm uppercase tracking-wider">Atendimento</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Trocas e Devoluções</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Rastrear Pedido</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Guia de Tamanhos</a></li>
          </ul>
        </div>

        {/* Coluna 3: Institucional */}
        <div>
          <h4 className="font-bold text-secondary mb-4 text-sm uppercase tracking-wider">Institucional</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><a href="#" className="hover:text-primary transition-colors">Sobre Nós</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Trabalhe Conosco</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a></li>
          </ul>
        </div>

        {/* Coluna 4: Newsletter */}
        <div>
          <h4 className="font-bold text-secondary mb-4 text-sm uppercase tracking-wider">Novidades</h4>
          <p className="text-sm text-muted mb-4">Receba 10% OFF na primeira compra.</p>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="Seu e-mail" 
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-secondary px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform">
              OK
            </button>
          </form>
        </div>
      </div>
      
      <div className="border-t border-gray-100 dark:border-gray-800 py-6 text-center">
        <p className="text-xs text-muted">© {new Date().getFullYear()} {tenantName}. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
