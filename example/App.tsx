import { useNavigate } from "@/hooks/useNavigate";
import { Route, Routes } from "@/index";
import { compilePath } from "@/utils/compilePath";
import { normalizePath } from "@/utils/normalizePath";
import { FC, useState } from "@freact/core";

const routes: [string, ReturnType<typeof compilePath>][] = [
  '/',
  '/test?/stuff?/test/test?/idk?',
  '/stuff/test?'
].map(x => [x, compilePath(normalizePath(x))]);

export const App: FC = () => {
  const [text, setText] = useState('');
  const navigate = useNavigate();

  return (
    <div>
      <input type='text' value={text} onInput={(e: any) => setText(e.target.value)} />
      <hr />
      {
        routes
          .filter(x => x[1][0].test(`/${normalizePath(text)}`))
          .map(x => <div>{x[0]}</div>)
      }
    </div>
  );

  // return (
  //   <div>
  //     <button onClick={() => navigate('/dude')}>goto</button>
  //     <Routes>
  //       <Route path="/" element={<div>index</div>} />
  //       <>
  //         <Route path="/test?/stuff?/test/test?/idk?" element={<div>test page</div>} />
  //         <Route path='/stuff/test?' element={<div>other</div>} />
  //         <Route path="/yo/:slug" element={<div>slug dude</div>}>
  //           <Route path='/' element={<div>slug index boy</div>} />
  //           <Route path='nest' element={<div>nest mate</div>} />
  //           <Route path='*' element={<div>fallback</div>} />
  //         </Route>
  //       </>
  //     </Routes>
  //   </div>
  // );
};
