import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
<<<<<<< HEAD
  route('signin', 'routes/signin.tsx'),
  route('signup', 'routes/signup.tsx'),
  // Temporarily disabled docs route due to source.generated.ts issues
  // route('docs/*', 'docs/page.tsx'),
  // route('api/search', 'docs/search.ts'),
=======
  route('docs', 'routes/docs/index.tsx'),
  route('docs/:id', 'routes/docs/[id].tsx'),
  route('api/search', 'docs/search.ts'),
>>>>>>> 4e2f2dc (Implement dynamic documentation viewer with MDX support, including sidebar navigation, document fetching from backend API, and error handling. Add new components for document viewing and sidebar, update routing, and enhance README with features and usage instructions.)
] satisfies RouteConfig;
