export function parsePath(path: string): string[] {
  const frags = (path[0] === '/' ? path.slice(1) : path).split('/');
  if (frags.at(-1) === '') frags.pop();
  return frags.map(x => decodeURI(x));
}
