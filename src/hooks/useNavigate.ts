import { RouterState } from "@/components/BrowserRouter";
import { OutletDepth } from "@/components/Outlet";
import { RoutesData } from "@/components/Routes";
import { concatPaths } from "@/utils/concatPaths";
import { getRouteNode } from "@/utils/getRouteNode";
import { normalizePath } from "@/utils/normalizePath";
import { raise } from "@/utils/raise";
import { resolveTraversal } from "@/utils/resolveTraversal";
import { stripWild } from "@/utils/stripWild";
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

  const navigate: NavigateFunction = useCallback((to: string | number, opts: NavigateOpts = {
    replace: false,
    relative: 'route',
    state: null
  }) => {
    if (typeof to === 'number') { // delta
      return history.go(to);
    }

    let newPath = '';

    if (to.startsWith('/')) { // absolute routing
      const endPath = resolveTraversal(normalizePath(to))[0];
      newPath = concatPaths(router.basepath, endPath);
    } else { // relative routing
      const [endPath, delta] = resolveTraversal(normalizePath(to));

      if (opts.relative === 'route') { // route relative
        if (parent && typeof depth === 'number') {
          let curr = getRouteNode(parent, depth + 1);
          if (!curr) raise('useNavigate unable to locate its RouteNode');

          // route traversal
          let routes = parent;
          for (let i = 0; i < delta; i++) {
            if (curr.parent) {
              curr = curr.parent;
            } else if (routes.parent) {
              routes = routes.parent;
              curr = routes.active!;
            } else {
              curr = null;
              break;
            }
          }

          newPath = concatPaths(
            router.basepath,
            stripWild(routes.parent?.active?.path ?? ''), // FIXME: still breaks when multiple <Routes> nesting
            stripWild(curr ? curr.path : ''),
            endPath
          );
        } else {
          newPath = concatPaths(router.basepath, endPath);
        }
      } else { // path relative
        let traversed = router.path;
        if (delta > 0 && traversed) {
          traversed += `/${[...Array(delta)].map(() => '..').join('/')}`;
          traversed = resolveTraversal(traversed)[0];
        }

        newPath = concatPaths(router.basepath, traversed, endPath);
      }
    }

    newPath = encodeURI(newPath);
    opts.replace
      ? history.replaceState(opts.state, '', `/${newPath}`)
      : history.pushState(opts.state, '', `/${newPath}`);

    router.setFullPath(newPath);
  }, [router, parent, depth]);

  return navigate;
};
