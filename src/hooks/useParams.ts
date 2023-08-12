import { RoutesData } from "@/components/Routes";
import { raise } from "@/utils/raise";
import { useContext } from "@freact/core";

function useParams<T extends { [K: string]: string; }>(): Readonly<T> {
  const data = useContext(RoutesData)
    ?? raise('Cannot use the useParams outisde of <Routes>.');

  return { ...data.params } as any;
}

export { useParams };
