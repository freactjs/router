import { Route, Routes, useNavigate } from "@/index";
import { FC } from "@freact/core";

const Nest: FC = () => {
  const navigate = useNavigate();
  return <button onClick={() => navigate('../../uh')}>test go</button>;
};

export const TestRoute: FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/qwe" element={<div>
          <Nest />
        </div>} />
      </Routes>
    </div>
  );
};
