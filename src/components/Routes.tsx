import { compilePath } from "@/utils/compilePath";
import { normalizePath } from "@/utils/normalizePath";
import { raise } from "@/utils/raise";
import { FC, FreactNode, createContext, memo, useContext, useRef } from "@freact/core";
import { RouterState } from "./BrowserRouter";
import { Route } from "./Route";
import { OutletDepth } from "./Outlet";

interface RouteNode {
  path: string;
  el: FreactNode;
  parent?: RouteNode;
  caseSensitive: boolean;
  matcher: RegExp;
  params: [string, number][];
  wild: number;
}

interface CacheItem {
  matcher: RegExp;
  params: [string, number][];
  wild: number;
}

type RouteCache = Map<string, CacheItem>;

function* enumRoutes(
  children: FreactNode[],
  cache: RouteCache,
  parent?: RouteNode
): Generator<RouteNode> {
  for (const child of children) {
    if (typeof child !== 'object' || child === null) continue;
    if (Array.isArray(child)) {
      for (const sub of enumRoutes(child, cache, parent)) yield sub;
      continue;
    }

    if (child.type !== Route) {
      const elName = typeof child.type === 'function'
        ? child.type.name
        : child.type;

      raise(`<${elName}> cannot be a child of <Routes>. Only <Route> components are permitted.`);
    }

    let newPath = normalizePath(child.props.path);
    if (parent) {
      const oldPath = parent.path.endsWith('*')
        ? parent.path.slice(0, -2)
        : parent.path;

      newPath = `${oldPath}${newPath.length > 0 ? '/' : ''}${newPath}`;
    }

    const res: RouteNode = {
      path: newPath,
      el: child.props.element,
      caseSensitive: !!child.props.caseSensitive,
      parent
    } as any;

    let hasIndex = false;
    if (child.props.children) {
      for (const sub of enumRoutes([child.props.children], cache, res)) {
        if (sub.path.length === newPath.length)
          hasIndex = !newPath.endsWith('*') || sub.path.endsWith('*');

        yield sub;
      }
    }

    if (hasIndex) continue;

    let cached: CacheItem | undefined;
    if (cached = cache.get(`${res.caseSensitive ? 's' : 'i'}:${newPath}`)) {
      res.matcher = cached.matcher;
      res.params = cached.params;
      res.wild = cached.wild;
    } else {
      let matcher, params, wild;
      if (cached = cache.get(`${res.caseSensitive ? 'i' : 's'}:${newPath}`)) {
        matcher = new RegExp(cached.matcher.source, res.caseSensitive ? '' : 'i');
        ({ params, wild } = cached);
      } else {
        [matcher, params, wild] = compilePath(newPath, child.props.caseSensitive);
      }

      res.matcher = matcher;
      res.params = params;
      res.wild = wild;

      cache.set(`${res.caseSensitive ? 's' : 'i'}:${newPath}`, {
        matcher,
        params,
        wild
      });
    }

    yield res;
  }
}

// FIXME: Memory leak - cache never cleans up unused items
// maybe lets make the cache work like before but ignore duplicate routes
function getRoutes(routes: FreactNode, cache: RouteCache): RouteNode[] {
  const res: RouteNode[] = [...enumRoutes([routes], cache)];

  res.sort((a, b) => {
    for (let i = 0;; i++) {
      if (i >= b.params.length && i >= a.params.length) {
        return b.wild - a.wild;
      } else if (i >= b.params.length || i >= a.params.length) {
        const aVal = i < a.params.length ? a.params[i][1] : a.wild;
        const bVal = i < b.params.length ? b.params[i][1] : b.wild;

        if (aVal === bVal)
          return i < b.params.length ? 1 : -1;

        return bVal - aVal;
      } else {
        if (a.params[i][1] > b.params[i][1]) {
          return -1;
        } else if (a.params[i][1] < b.params[i][1]) {
          return 1;
        }
      }
    }
  });

  return res;
}

export const RoutesData = createContext<{
  wildpath: string | null;
  params: { [K: string]: string; };
  active: RouteNode | null;
}>();

export const Routes: FC<{ children?: FreactNode; }> = memo(({ children }) => {
  const cache = useRef<RouteCache>(new Map());
  const router = useContext(RouterState)
    ?? raise('Cannot use <Routes> outisde of <BrowserRouter>.');

  try {
    const path = encodeURI(decodeURI(`/${router.path}`));
    let wildpath: string | null = null;
    let params: { [K: string]: string; } = {};
    let active: RouteNode | null = null;
    let elem: FreactNode = null;
    let depth = -1;

    for (const route of getRoutes(children, cache.current)) {
      const match = path.match(route.matcher);
      if (!match) continue;

      for (const [name, index] of route.params) {
        let paramVal;
        if (paramVal = match.at(index + 1)) {
          params[name] = decodeURIComponent(paramVal.slice(1));
        }
      }

      if (route.wild < Infinity)
        wildpath = (match.at(-1) ?? '/').slice(1);

      let curr = route;
      while (curr.parent) {
        curr = curr.parent;
        depth++;
      }

      active = route;
      elem = curr.el;
      break;
    }

    return (
      <RoutesData.Provider value={{ wildpath, params, active }}>
        <OutletDepth.Provider value={depth}>
          {elem}
        </OutletDepth.Provider>
      </RoutesData.Provider>
    );
  } catch (err: any) {
    console.error(err.message);
    return <></>;
  }
});
