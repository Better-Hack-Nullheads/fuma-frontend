import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('signin', 'routes/signin.tsx'),
  route('signup', 'routes/signup.tsx'),
  // Temporarily disabled docs route due to source.generated.ts issues
  // route('docs/*', 'docs/page.tsx'),
  // route('api/search', 'docs/search.ts'),
] satisfies RouteConfig;
