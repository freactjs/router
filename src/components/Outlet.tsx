import { getRouteNode } from "@/utils/getRouteNode";
import { FC, createContext, memo, useContext } from "@freact/core";
import { RoutesData } from "./Routes";

export const OutletDepth = createContext<number>();

export const Outlet: FC = memo(() => {
  const parent = useContext(RoutesData);
  const depth = useContext(OutletDepth);
  const curr = getRouteNode(parent, depth);

  if (!curr) return <></>;
  return (
    <OutletDepth.Provider value={depth - 1}>
      {curr.el}
    </OutletDepth.Provider>
  );
});
