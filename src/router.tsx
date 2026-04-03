import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from './App';
import { HomePage } from './pages/HomePage';
import { ChallengePage } from './pages/ChallengePage';

const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <Suspense fallback={null}><AboutPage /></Suspense> },
      { path: 'challenge', element: <ChallengePage /> },
    ],
  },
]);
