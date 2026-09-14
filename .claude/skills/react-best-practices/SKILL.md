# React Best Practices

Build the frontend with maintainable, accessible React patterns.

- Use functional components only; prefer hooks over class components.
- Create custom data-fetching hooks such as `useLabs` and `useSubmissions`.
- Use an Axios client with interceptors for JWT injection and 401 redirect behavior.
- Use React Router v7 for routing and protected route wrappers.
- Add error boundaries around route-level components.
- Use Suspense and lazy loading for heavy pages.
- Keep components focused, composable, and testable.
- Keep loading, empty, error, and success states explicit rather than hiding network behavior.
