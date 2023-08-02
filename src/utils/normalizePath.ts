export const normalizePath = (path: string): string => {
  const normalized = path[0] === '/' ? path.slice(1) : path;
  return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
};
