import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { TaskProvider } from './store/TaskContext.tsx';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = new URL('sw.js', import.meta.env.BASE_URL).toString();
    navigator.serviceWorker.register(swUrl).catch(() => {
      // best-effort: app still works without SW
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TaskProvider>
      <App />
    </TaskProvider>
  </StrictMode>
);
