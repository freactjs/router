import { normalizePath } from "@/utils/normalizePath";
import { FC, FreactNode, StateSetter, createContext, memo, useEffect, useMemo, useState } from "@freact/core";

export const RouterState = createContext<{
  path: string;
  basepath: string;
  setFullPath: StateSetter<string>;
}>();

export const BrowserRouter: FC<{
  children?: FreactNode;
  basename?: string;
}> = memo(({ children, basename = '/' }) => {
  const [fullPath, setFullPath] = useState(() => normalizePath(location.pathname));

  useEffect(() => {
    const onPopState = () => {
      setFullPath(normalizePath(location.pathname));
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const [basepath, basematcher]: [string, RegExp] = useMemo(() => {
    const normalized = normalizePath(basename);
    let reSrc = normalized.replace(/[\\.*+^$?{}|()[\]]/g, "\\$&");
    reSrc += "(/[a-zA-Z0-9.\\-/%_~!$&'()*+,;=:@]+)?";
    return [normalized, new RegExp(reSrc, 'i')];
  }, [basename]);

  const path = useMemo(() => {
    const match = `/${fullPath}`.match(basematcher);
    if (!match) return null;
    return (match.at(1) ?? '/').slice(1);
  }, [fullPath, basematcher]);

  if (path === null) {
    console.error(`Current path doesn't match the specified basename /${basepath}.`);
    return <></>;
  }

  return (
    <RouterState.Provider value={{ path, basepath, setFullPath }}>
      {children}
    </RouterState.Provider>
  );
});
