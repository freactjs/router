import { RouterState } from "@/components/BrowserRouter";
import { OutletDepth } from "@/components/Outlet";
import { RoutesData } from "@/components/Routes";
import { raise } from "@/utils/raise";
import { resolveNavigationPath } from "@/utils/resolveNavigationPath";
import { useCallback, useContext } from "@freact/core";

export type RelativeRoutingType = 'route' | 'path';

interface NavigateOpts {
  replace?: boolean;
  relative?: RelativeRoutingType;
  state?: any;
}

interface NavigateFunction {
  (to: string, opts?: NavigateOpts): void;
  (delta: number): void;
}

export const useNavigate = (): NavigateFunction => {
  const router = useContext(RouterState)
    ?? raise('Cannot use the useNavigate hook outisde of <BrowserRouter>.');
  const parent = useContext(RoutesData);
  const depth = useContext(OutletDepth);

  const navigate: NavigateFunction = useCallback((to: string | number, {
    relative = 'route',
    replace = false,
    state = null
  }: NavigateOpts = {}) => {
    if (typeof to === 'number') { // delta
      return history.go(to);
    }

    const newPath = resolveNavigationPath({
      to, router, parent, depth, relative
    });

    replace
      ? history.replaceState(state, '', `/${newPath}`)
      : history.pushState(state, '', `/${newPath}`);

    router.setFullPath(newPath);
  }, [router, parent, depth]);

  return navigate;
};
