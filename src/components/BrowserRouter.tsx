import { normalizePath } from "@/utils/normalizePath";
import { FC, FreactNode, createContext, useCallback, useEffect, useState } from "@freact/core";

export const RouterState = createContext<{
  path: string;
  push: (path: string, replace?: boolean) => void;
}>();

export const BrowserRouter: FC<{
  children?: FreactNode;
  basename?: string;
}> = ({ children, basename = '/' }) => {
  const [path, setPath] = useState(() => location.pathname);

  const push = useCallback((dest: string, replace?: boolean) => {
    let newPath = normalizePath(dest);
    newPath = dest[0] === '/' ? newPath : `${path}/${newPath}`;

    setPath(newPath);
    replace
      ? history.replaceState(null, '', `/${newPath}`)
      : history.pushState(null, '', `/${newPath}`);
  }, [path]);

  useEffect(() => {
    const onPopState = () => {
      setPath(normalizePath(location.pathname));
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <RouterState.Provider value={{ path, push }}>
      {/* <Routes>
        <Route path={basename} element={children} />
      </Routes> */}
      {children}
    </RouterState.Provider>
  );
};
