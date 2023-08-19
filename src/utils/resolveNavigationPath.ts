import { RouterStateType } from "@/components/BrowserRouter";
import { RoutesDataType } from "@/components/Routes";
import { RelativeRoutingType } from "@/hooks/useNavigate";
import { concatPaths } from "./concatPaths";
import { getRouteNode } from "./getRouteNode";
import { normalizePath } from "./normalizePath";
import { raise } from "./raise";
import { resolveTraversal } from "./resolveTraversal";
import { stripWild } from "./stripWild";

export function resolveNavigationPath({
  to, router, parent, depth, relative
}: {
  to: string;
  router: RouterStateType;
  parent: RoutesDataType | undefined;
  depth: number | undefined;
  relative: RelativeRoutingType;
}) {
  let newPath = '';

  if (to.startsWith('/')) { // absolute routing
    const endPath = resolveTraversal(normalizePath(to))[0];
    newPath = concatPaths(router.basepath, endPath);
  } else { // relative routing
    const [endPath, delta] = resolveTraversal(normalizePath(to));

    if (relative === 'route') { // route relative
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

        let midPaths: string[] = [];
        while (routes.parent) {
          midPaths.unshift(stripWild(routes.parent.active?.path ?? ''));
          routes = routes.parent;
        }

        newPath = concatPaths(
          router.basepath,
          ...midPaths,
          stripWild(curr ? curr.path : ''),
          endPath
        );
      } else {
        newPath = concatPaths(router.basepath, endPath);
      }
    } else { // path relative
      let traversed = router.path;
      if (delta > 0 && traversed) {
        traversed += '/..'.repeat(delta);
        traversed = resolveTraversal(traversed)[0];
      }

      newPath = concatPaths(router.basepath, traversed, endPath);
    }
  }

  return encodeURI(newPath);
}
