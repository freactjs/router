import { useNavigate } from "@/hooks/useNavigate";
import { Route, Routes } from "@/index";
import { FC, useState } from "@freact/core";

"(\/([a-zA-Z0-9.\-_~!$&'()*+,;=:@]|(%[0-9]{2}))+)?" // optional param

export const App: FC = () => {
  const [text, setText] = useState('');
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate('/dude')}>goto</button>
      <Routes>
        <Route path="/" element={<div>index</div>} />
        <>
          <Route path="/test?/stuff?/test/test?/idk?" element={<div>test page</div>} />
          <Route path='/stuff/test?' element={<div>other</div>} />
          <Route path="/yo/:slug" element={<div>slug dude</div>}>
            <Route path='/' element={<div>slug index boy</div>} />
            <Route path='nest' element={<div>nest mate</div>} />
            <Route path='ass' element={<div>fallback</div>} />
          </Route>
        </>
      </Routes>
    </div>
  );
};
