import { RelativeRoutingType, useNavigate } from "@/hooks/useNavigate";
import { FC, useEffect } from "@freact/core";

export const Navigate: FC<{
  to: string;
  replace?: boolean;
  state?: any;
  relative?: RelativeRoutingType;
}> = ({ to, replace = false, state = null, relative = 'route' }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace, state, relative });
  }, []);

  return <></>;
};
