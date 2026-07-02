import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import Clarity from '@microsoft/clarity';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID;
if (clarityProjectId) {
  Clarity.init(clarityProjectId);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Analytics />
  </StrictMode>,
);
