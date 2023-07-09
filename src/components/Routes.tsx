import { FC, FreactNode } from "@freact/core";
import { Route } from "./Route";
import { raise } from "@/utils/raise";

interface RouteNode {
  path: string;
  el: FreactNode;
  children?: RouteNode[];
}

function* getRoutes(children: FreactNode[]): Generator<RouteNode> {
  for (const child of children) {
    if (typeof child !== 'object' || child === null) continue;
    if (Array.isArray(child)) {
      for (const sub of getRoutes(child)) yield sub;
      continue;
    }

    if (child.type !== Route) {
      const elName = typeof child.type === 'function'
        ? child.type.name
        : child.type as string;

      raise(`<${elName}> cannot be a child of <Routes>. Only <Route> components are permitted.`);
    }

    const res: RouteNode = {
      el: child.props.element,
      path: child.props.path
    };

    if (child.props.children) {
      res.children = [...getRoutes([child.props.children])];
    }

    yield res;
  }
}

export const Routes: FC<{ children?: FreactNode; }> = ({ children }) => {
  try {
    const hierarchy = [...getRoutes([children])];
    console.log(hierarchy);
  } catch (err: any) {
    console.error(err.message);
    return <></>;
  }

  return <div>this a router</div>;
};
