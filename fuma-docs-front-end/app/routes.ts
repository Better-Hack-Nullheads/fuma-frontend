import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('docs', 'routes/docs/index.tsx'),
  route('docs/:id', 'routes/docs/[id].tsx'),
  route('docs/edit/:id', 'routes/docs/edit/[id].tsx'),
  route('api/search', 'docs/search.ts'),
] satisfies RouteConfig;
