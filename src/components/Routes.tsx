import { parsePath } from "@/utils/parsePath";
import { raise } from "@/utils/raise";
import { FC, FreactNode, createContext, useContext } from "@freact/core";
import { RouterState } from "./BrowserRouter";
import { Route } from "./Route";

interface RouteNode {
  path: string[];
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

    let path = [...(parent?.path ?? [])];
    if (path.length > 0 && path.at(-1) === '*') path.pop();
    path.push(...parsePath(child.props.path));

    const res: RouteNode = {
      path,
      el: child.props.element,
      parent: parent
    };

    let hasIndex = false;
    if (child.props.children) {
      for (const sub of getRoutes([child.props.children], res)) {
        if (sub.path.length === res.path.length)
          hasIndex = path.at(-1) !== '*' || sub.path.at(-1) === '*';

        yield sub;
      }
    }

    if (!hasIndex)
      yield res;
  }
}

enum SegmentType {
  EXACT,
  PARAM,
  WILD
}

function findMatch(routes: FreactNode, path: string[]) {
  for (const route of getRoutes([routes])) {
    let routePtr = 0, pathPtr = 0, optionals = 0;

    while (true) {
      if (routePtr >= route.path.length || (pathPtr >= path.length && optionals < 1)) {
        let isMatching = routePtr === route.path.length && pathPtr === path.length;

        if (!isMatching && routePtr < route.path.length) {
          let hasExact = false;
          for (let i = routePtr; i < route.path.length; i++) {
            if (!route.path[i].endsWith('?') && route.path[i] !== '*') {
              hasExact = true;
              break;
            }
          }

          isMatching = !hasExact;
        }

        if (isMatching) {
          console.log(route.path.join('/'));
        }

        break;
      }

      const isOptional = route.path[routePtr].endsWith('?');
      const currRoute = isOptional
        ? route.path[routePtr].slice(0, route.path[routePtr].length - 1)
        : route.path[routePtr];

      let hasFound = false;
      for (let i = 0; i <= optionals; i++) {
        if (pathPtr - i >= path.length || pathPtr - i < 0) continue;
        if (currRoute === path[pathPtr - i]) {
          isOptional ? optionals++ : optionals = 0;
          pathPtr -= i;
          hasFound = true;
          routePtr++;
          pathPtr++;
          break;
        } else {
          if (isOptional) {
            hasFound = true;
            optionals++;
            routePtr++;
            break;
          }
        }
      }

      if (!hasFound) {
        break;
      }

      // if (currRoute === '*') { // wild

      // } else if (currRoute[0] === ':') { // param

      // } else { // exact
      //   if (currRoute === path[pathPtr]) {
      //     isOptional && optionals++;
      //     exactNum++;
      //     routePtr++;
      //     pathPtr++;
      //   } else {
      //     if (!isOptional) break;
      //     routePtr++;
      //   }
      // }
    }
  }
}

export const RoutesContext = createContext<{
  unresolved: string[];
}>();

export const Routes: FC<{ children?: FreactNode; }> = ({ children }) => {
  const router = useContext(RouterState)
    ?? raise('Cannot use <Routes> outisde of <BrowserRouter>.');

  try {
    findMatch(children, router.path);
    return <div>router placeholder</div>;
  } catch (err: any) {
    console.error(err.message);
    return <></>;
  }
};
