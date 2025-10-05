import type { Route } from './+types/home';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link } from 'react-router';
import { baseOptions } from '@/lib/layout.shared';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dynamic Documentation Viewer' },
    { name: 'description', content: 'View and browse dynamic MDX documentation from your backend API' },
  ];
}

export default function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="p-4 flex flex-col items-center justify-center text-center flex-1">
        <h1 className="text-3xl font-bold mb-4">Dynamic Documentation Viewer</h1>
        <p className="text-fd-muted-foreground mb-6 max-w-2xl">
          A modern documentation frontend that dynamically fetches and renders MDX files from your backend API. 
          Built with React, TypeScript, Vite, and Fumadocs.
        </p>
        <div className="flex gap-4">
          <Link
            className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-6 py-3 hover:opacity-90 transition-opacity"
            to="/docs"
          >
            Browse Documentation
          </Link>
          <Link
            className="text-sm border border-fd-border rounded-full font-medium px-6 py-3 hover:bg-fd-muted transition-colors"
            to="/docs"
          >
            View All Docs
          </Link>
        </div>
        <div className="mt-8 text-sm text-fd-muted-foreground">
          <p>Features: Dynamic MDX rendering • Responsive sidebar • Real-time refresh • Error handling</p>
        </div>
      </div>
    </HomeLayout>
  );
}