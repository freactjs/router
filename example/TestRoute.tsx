import { Route, Routes, useNavigate } from "@/index";
import { FC } from "@freact/core";

const Supernest: FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>supernest</div>
      <button onClick={() => navigate(-1)}>navig</button>
    </>
  );
};

const Nest: FC = () => {
  return (
    <Routes>
      <Route path='super' element={<Supernest />} />
    </Routes>
  );
};

export const TestRoute: FC = () => {
  return (
    <div>
      <Routes>
        <Route path="qwe/*" element={<Nest />} />
      </Routes>
    </div>
  );
};
