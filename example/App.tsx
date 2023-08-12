import { Outlet } from "@/components/Outlet";
import { useNavigate } from "@/hooks/useNavigate";
import { Route, Routes } from "@/index";
import { FC } from "@freact/core";
import { TestRoute } from "./TestRoute";

export const App: FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate('/test/hello')}>goto</button>
      <Routes>
        <Route path="/" element={<div>index</div>} />
        <Route path="/test/:slug" element={<TestRoute />}>
          <Route path='/' element={<div>slug index</div>} />
          <Route path='nest' element={
            <div>
              <div>nest</div>
              <Outlet />
            </div>
          }>
            <Route path='' element={<div>nested index</div>} />
            <Route path='alt' element={<div>nested alt</div>} />
          </Route>
          <Route path='*' element={<div>fallback</div>} />
        </Route>
      </Routes>
    </div>
  );
};
