import { normalizePath } from "@/utils/normalizePath";
import { raise } from "@/utils/raise";
import { FC, FreactNode, createContext, useContext } from "@freact/core";
import { RouterState } from "./BrowserRouter";
import { Route } from "./Route";
import { compilePath } from "@/utils/compilePath";

interface RouteNode {
  path: string;
  matcher: RegExp;
  specificity: number;
  params: [string, number][];
  wild: number | null;
  el: FreactNode;
  parent?: RouteNode;
}

function* getRoutes(children: FreactNode[], parent?: RouteNode): Generator<RouteNode> {
  for (const child of children) {
    if (typeof child !== 'object' || child === null) continue;
    if (Array.isArray(child)) {
      for (const sub of getRoutes(child, parent)) yield sub;
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
      parent
    } as any;

    let hasIndex = false;
    if (child.props.children) {
      for (const sub of getRoutes([child.props.children], res)) {
        if (sub.path.length === newPath.length)
          hasIndex = !newPath.endsWith('*') || sub.path.endsWith('*');

        yield sub;
      }
    }

    const [matcher, specificity, params, wild] = compilePath(newPath);
    res.specificity = specificity;
    res.matcher = matcher;
    res.params = params;
    res.wild = wild;

    if (!hasIndex) yield res;
  }
}

function findMatch(routes: FreactNode) {
  for (const route of getRoutes([routes])) {
    console.log(route);
  }
}

export const RoutesContext = createContext<{
  unresolved: string[];
}>();

export const Routes: FC<{ children?: FreactNode; }> = ({ children }) => {
  const router = useContext(RouterState)
    ?? raise('Cannot use <Routes> outisde of <BrowserRouter>.');

  try {
    findMatch(children);
    return <div>router placeholder</div>;
  } catch (err: any) {
    console.error(err.message);
    return <></>;
  }
};
