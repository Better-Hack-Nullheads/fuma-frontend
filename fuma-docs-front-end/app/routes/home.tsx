import type { Route } from './+types/home';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dynamic Documentation Viewer' },
    { name: 'description', content: 'Open documentation viewer for dynamic content' },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to docs page
    navigate('/docs');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-fd-foreground mb-4">
          Dynamic Documentation Viewer
        </h1>
        <p className="text-fd-muted-foreground">Redirecting to documentation...</p>
      </div>
    </div>
  );
}