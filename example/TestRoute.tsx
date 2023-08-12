import { Outlet } from "@/components/Outlet";
import { useParams } from "@/hooks/useParams";
import { FC } from "@freact/core";

export const TestRoute: FC = () => {
  const { slug } = useParams();

  return (
    <>
      <div>slug: {slug}</div>
      <Outlet />
      <Outlet />
    </>
  );
};
