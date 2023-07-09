import { FC, FreactNode, createContext, useCallback, useEffect, useState } from "@freact/core";

function splitPath(path: string): string[] {
  const frags = (path[0] === '/' ? path.slice(1) : path).split('/');
  if (frags.at(-1) === '') frags.pop();
  return frags.map(x => decodeURI(x));
}

export const RouterState = createContext<{
  basename: string;
  path: string[];
  push: (path: string, replace?: boolean) => void;
}>();

export const BrowserRouter: FC<{
  children?: FreactNode;
  basename?: string;
}> = ({ children, basename = '/' }) => {
  const [path, setPath] = useState(() => splitPath(location.pathname));

  const push = useCallback((dest: string, replace?: boolean) => {
    let newPath = splitPath(dest);
    newPath = dest[0] === '/' ? newPath : [...path, ...newPath];

    setPath(newPath);
    replace
      ? history.replaceState(null, '', `/${newPath.join('/')}`)
      : history.pushState(null, '', `/${newPath.join('/')}`);
  }, [path]);

  useEffect(() => {
    const onPopState = () => {
      setPath(splitPath(location.pathname));
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <RouterState.Provider value={{
      basename, path, push
    }}>
      {children}
    </RouterState.Provider>
  );
};
