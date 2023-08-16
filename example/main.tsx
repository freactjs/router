import { BrowserRouter } from '@/index';
import { createRoot } from '@freact/core';
import { App } from './App';
import './style.css';

createRoot('#root').render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
