import type { Route } from './+types/home';
import { Link } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
<<<<<<< HEAD
    { title: 'AutoDoc - API Documentation Platform' },
    { name: 'description', content: 'Welcome to AutoDoc!' },
=======
    { title: 'Dynamic Documentation Viewer' },
    { name: 'description', content: 'View and browse dynamic MDX documentation from your backend API' },
>>>>>>> 4e2f2dc (Implement dynamic documentation viewer with MDX support, including sidebar navigation, document fetching from backend API, and error handling. Add new components for document viewing and sidebar, update routing, and enhance README with features and usage instructions.)
  ];
}

export default function Home() {
  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h1 className="text-xl font-bold">AutoDoc</h1>
            </div>
            <div className="flex gap-2">
              <Link
                to="/signin"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">
            API Documentation Made Simple
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Generate beautiful, interactive documentation for your APIs automatically.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/signin"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/signup"
              className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>
    </div>
=======
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
>>>>>>> 4e2f2dc (Implement dynamic documentation viewer with MDX support, including sidebar navigation, document fetching from backend API, and error handling. Add new components for document viewing and sidebar, update routing, and enhance README with features and usage instructions.)
  );
}
