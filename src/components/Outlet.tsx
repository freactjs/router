import { FC, createContext, memo, useContext } from "@freact/core";
import { RoutesData } from "./Routes";

export const OutletDepth = createContext<number>();

export const Outlet: FC = memo(() => {
  const data = useContext(RoutesData);
  const depth = useContext(OutletDepth);

  if (
    !data?.active?.parent ||
    typeof depth !== 'number' || depth < 0
  ) return <></>;

  let curr = data.active;
  for (let i = 0; i < depth; i++)
    curr = curr.parent!;

  return (
    <OutletDepth.Provider value={depth - 1}>
      {curr.el}
    </OutletDepth.Provider>
  );
});
