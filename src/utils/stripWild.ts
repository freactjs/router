export const isWild = (path: string) => path === '*' || path.endsWith('/*');
export const stripWild = (path: string) => isWild(path) ? path.slice(0, -2) : path;
