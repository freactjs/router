export function resolveTraversal(path: string): [string, number] {
  const parts = path.split('/');
  let delta = 0;

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === '.') {
      parts.splice(i--, 1);
    } else if (parts[i] === '..') {
      parts.splice(i--, 1);
      i >= 0
        ? parts.splice(i--, 1)
        : delta++;
    }
  }

  return [parts.join('/'), delta];
}
