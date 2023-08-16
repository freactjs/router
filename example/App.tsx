import { NavLink } from "@/components/NavLink";
import { Navigate } from "@/components/Navigate";
import { Route, Routes } from "@/index";
import { FC } from "@freact/core";

export const App: FC = () => {
  return (
    <div>
      <NavLink to='/'>home</NavLink>
      <NavLink to='/about'>about</NavLink>
      <hr />
      <Routes>
        <Route path="/" element={<div>index</div>} />
        <Route path="/about" element={<div>about</div>} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </div>
  );
};
