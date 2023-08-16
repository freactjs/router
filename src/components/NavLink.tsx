import { raise } from "@/utils/raise";
import { resolveNavigationPath } from "@/utils/resolveNavigationPath";
import { FC, FreactNode, memo, useContext } from "@freact/core";
import { RouterState } from "./BrowserRouter";
import { OutletDepth } from "./Outlet";
import { RoutesData } from "./Routes";

interface StyleType {
  [K: string]: string;
}

export const NavLink: FC<{
  to: string;
  replace?: boolean;
  end?: boolean;
  caseSensitive?: boolean;
  state?: any;
  reloadDocument?: boolean;
  relative?: "route" | "path";
  className?: string | ((args: { isActive: boolean; }) => string);
  style?: StyleType | ((args: { isActive: boolean; }) => StyleType);
  children?: FreactNode | ((args: { isActive: boolean; }) => FreactNode);
}> = memo(({
  to,
  replace = false,
  end = false,
  caseSensitive = false,
  state = null,
  reloadDocument = false,
  relative = 'route',
  className,
  style,
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

  const isActive = (() => {
    const activePath = caseSensitive ? router.fullPath : router.fullPath.toLowerCase();
    const linkPath = caseSensitive ? newPath : newPath.toLowerCase();
    return (end || newPath === '') ? (activePath === linkPath) : activePath.startsWith(linkPath);
  })();

  const classNameStr = typeof className === 'function'
    ? className({ isActive })
    : className;

  return (
    <a
      href={`/${newPath}`}
      onClick={onClick}
      className={`${classNameStr} ${isActive ? 'active' : ''}`}
      style={typeof style === 'function' ? style({ isActive }) : style}
    >{typeof children === 'function' ? children({ isActive }) : children}</a>
  );
});
