import { RouteNode, RoutesDataType } from "@/components/Routes";

export function getRouteNode(
  parent: RoutesDataType | undefined, depth: number | undefined
): RouteNode | null {
  if (!parent?.active || typeof depth !== 'number' || depth < 0) {
    return null;
  }

  let curr = parent.active;
  for (let i = 0; i < depth; i++) {
    if (!curr.parent) return null;
    curr = curr.parent;
  }

  return curr;
}
