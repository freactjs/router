import { RouterState } from "@/components/BrowserRouter";
import { OutletDepth } from "@/components/Outlet";
import { RoutesData } from "@/components/Routes";
import { concatPaths } from "@/utils/concatPaths";
import { normalizePath } from "@/utils/normalizePath";
import { raise } from "@/utils/raise";
import { resolveTraversal } from "@/utils/resolveTraversal";
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
  const depth = useContext(OutletDepth);
  const parent = useContext(RoutesData);
  const router = useContext(RouterState)
    ?? raise('Cannot use the useNavigate hook outisde of <BrowserRouter>.');

  const navigate: NavigateFunction = useCallback((to: string | number, opts: NavigateOpts = {
    replace: false,
    relative: 'route',
    state: null
  }) => {
    if (typeof to === 'number') { // delta
      return history.go(to);
    }

    if (to.startsWith('/')) { // absolute routing
      const endPath = resolveTraversal(normalizePath(to))[0];
      const newPath = encodeURI(concatPaths(router.basepath, endPath));

      opts.replace
        ? history.replaceState(opts.state, '', `/${newPath}`)
        : history.pushState(opts.state, '', `/${newPath}`);

      return router.setFullPath(newPath);
    }

    // relative routing
    const [endPath, delta] = resolveTraversal(normalizePath(to));
    if (opts.relative === 'route') { // route relative
      // TODO
    } else { // path relative
      let traversed = router.path;
      if (delta > 0 && traversed) {
        traversed += `/${[...Array(delta)].map(() => '..').join('/')}`;
        traversed = resolveTraversal(traversed)[0];
      }

      const newPath = encodeURI(concatPaths(router.basepath, traversed, endPath));
      opts.replace
        ? history.replaceState(opts.state, '', `/${newPath}`)
        : history.pushState(opts.state, '', `/${newPath}`);

      router.setFullPath(newPath);
    }
  }, [router, parent, depth]);

  return navigate;
};
