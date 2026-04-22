import { createBrowserRouter } from 'react-router';
import { HomePage } from './components/HomePage';
import { SearchResultsPage } from './components/SearchResultsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/search',
    Component: SearchResultsPage,
  },
]);
