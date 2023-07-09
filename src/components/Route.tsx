import { FC, FreactNode } from "@freact/core";

export interface RouteProps {
  path: string;
  element: FreactNode;
  caseSensitive?: boolean;
  children?: FreactNode;
}

export const Route: FC<RouteProps> = () => {
  console.error('<Route> must be a child of <Routes> or another <Route>.');
  return <></>;
};
