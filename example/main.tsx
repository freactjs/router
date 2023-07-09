import { createRoot } from '@freact/core';
import { BrowserRouter } from '@/index';
import { App } from './App';

createRoot('#root').render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
