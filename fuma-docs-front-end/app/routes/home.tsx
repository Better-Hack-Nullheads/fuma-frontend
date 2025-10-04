import type { Route } from './+types/home';
import { Link } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'AutoDoc - API Documentation Platform' },
    { name: 'description', content: 'Welcome to AutoDoc!' },
  ];
}

export default function Home() {
  return (
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
  );
}
