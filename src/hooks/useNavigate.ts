import { RouterState } from "@/components/BrowserRouter";
import { useCallback, useContext } from "@freact/core";
import { raise } from "@/utils/raise";

type Navigate = (path: string | number, opts?: { replace?: boolean }) => void;

export const useNavigate = (): Navigate => {
  const router = useContext(RouterState)
    ?? raise('Cannot use the useNavigate hook outisde of <BrowserRouter>.');

  const navigate: Navigate = useCallback((path, opts) => {
    if (typeof path === 'number') return history.go(path);
    router.push(path, opts?.replace);
  }, [router.push]);

  return navigate;
};
