import { raise } from "@/utils/raise";
import { resolveNavigationPath } from "@/utils/resolveNavigationPath";
import { FC, FreactNode, memo, useContext } from "@freact/core";
import { RouterState } from "./BrowserRouter";
import { OutletDepth } from "./Outlet";
import { RoutesData } from "./Routes";

export const Link: FC<{
  to: string;
  replace?: boolean;
  state?: any;
  reloadDocument?: boolean;
  relative?: "route" | "path";
  children?: FreactNode;
}> = memo(({
  to,
  replace = false,
  state = null,
  reloadDocument = false,
  relative = 'route',
  children
}) => {
  const router = useContext(RouterState)
    ?? raise('Cannot use <Link> outisde of <BrowserRouter>.');
  const parent = useContext(RoutesData);
  const depth = useContext(OutletDepth);

  const newPath = resolveNavigationPath({
    to, router, parent, depth, relative
  });

  const onClick = (e: Event) => {
    if (reloadDocument) return;
    e.preventDefault();

    replace
      ? history.replaceState(state, '', `/${newPath}`)
      : history.pushState(state, '', `/${newPath}`);

    router.setFullPath(newPath);
  };

  return (
    <a
      href={`/${newPath}`}
      onClick={onClick}
    >{children}</a>
  );
});
