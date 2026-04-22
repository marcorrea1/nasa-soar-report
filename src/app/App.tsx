import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AdminProvider } from './contexts/AdminContext';

export default function App() {
  return (
    <AdminProvider>
      <RouterProvider router={router} />
    </AdminProvider>
  );
}
