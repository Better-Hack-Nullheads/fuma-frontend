import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signinUser } from "../store/slices/authSlices";
import type { Route } from './+types/signin';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sign In - AutoDoc' },
    { name: 'description', content: 'Sign in to access the developer portal' },
  ];
}

export default function SignIn() {
  const [apiKey, setApiKey] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(signinUser({ apiKey }));
      if (signinUser.fulfilled.match(result)) {
        // Sign in successful, navigate to docs
        navigate('/docs');
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">AutoDoc</h1>
          </div>
          <p className="text-fd-muted-foreground">
            Sign in to access the developer portal
          </p>
        </div>

        <div className="rounded-2xl shadow-lg border bg-fd-card p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Welcome Back</h2>
            <p className="text-sm text-fd-muted-foreground">
              Enter your credentials to continue
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium">
                API Key
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fd-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-fd-border rounded-lg bg-fd-background focus:outline-none focus:ring-2 focus:ring-fd-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 bg-fd-primary text-fd-primary-foreground rounded-lg font-medium hover:bg-fd-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-fd-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-center text-sm text-fd-muted-foreground">
              Don't have an API key?{" "}
              <Link
                to="/signup"
                className="text-fd-primary hover:underline font-medium"
              >
                Get one here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
