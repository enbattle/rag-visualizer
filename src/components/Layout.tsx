import { Outlet, Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-border">
        <Link to="/" className="font-display font-bold text-sm text-text-primary tracking-wide">
          RAG Visualizer
        </Link>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/enbattle/rag-visualizer"
            target="_blank"
            rel="noreferrer"
            className="text-text-muted hover:text-text-primary transition-colors"
            aria-label="View source on GitHub"
          >
            <Github size={16} />
          </a>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
