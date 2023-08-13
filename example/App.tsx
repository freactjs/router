import { useNavigate } from "@/hooks/useNavigate";
import { Route, Routes } from "@/index";
import { FC } from "@freact/core";
import { TestRoute } from "./TestRoute";

export const App: FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate('../route', { relative: 'path' })}>goto</button>
      <Routes>
        <Route path="/" element={<div>index</div>} />
        <Route path='/test/qwe/asd' element={<TestRoute />} />
      </Routes>
    </div>
  );
};
