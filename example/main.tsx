import { BrowserRouter } from '@/index';
import { createRoot } from '@freact/core';
import { App } from './App';

createRoot('#root').render(
  <BrowserRouter basename='base'>
    <App />
  </BrowserRouter>
);
