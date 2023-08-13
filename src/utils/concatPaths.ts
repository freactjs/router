export function concatPaths(...paths: string[]) {
  let res = '';
  for (const path of paths) {
    if (res && path) res += '/';
    res += path;
  }

  return res;
}
