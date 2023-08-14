import { Link } from "@/components/Link";
import { Navigate } from "@/components/Navigate";
import { Route, Routes } from "@/index";
import { FC } from "@freact/core";

export const App: FC = () => {
  return (
    <div>
      <Link to='/test' reloadDocument>click me</Link>
      <Routes>
        <Route path="/" element={<div>index</div>} />
        <Route path="/test" element={<div>test</div>} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </div>
  );
};
