import type { Route } from './+types/home';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'AutoDoc - Sign In' },
    { name: 'description', content: 'Sign in to access AutoDoc' },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to signin page
    navigate('/signin');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-fd-muted-foreground">Redirecting to sign in...</p>
      </div>
    </div>
  );
}