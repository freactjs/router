import { useNavigate } from "@/hooks/useNavigate";
import { Route, Routes } from "@/index";
import { FC } from "@freact/core";

export const App: FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate('test')}>test</button>
      <Routes>
        <>
          <Route path="/" element={<div>index</div>} />
          <Route path="/test" element={<div>test page</div>} />
        </>
        <Route path="/yo/:slug" element={<div>slug dude</div>}>
          <Route path='/' element={<div>slug index boy</div>} />
          <Route path='nest' element={<div>nest mate</div>} />
        </Route>
      </Routes>
    </div>
  );
};
