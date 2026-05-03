import { createContext, useContext, useState } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  login: () => false,
  logout: () => {},
});

// Set VITE_ADMIN_PASSWORD in your .env file — never hardcode this
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'changeme';

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem('nasa_admin') === 'true'
  );

  function login(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('nasa_admin', 'true');
      return true;
    }
    return false;
  }

  function logout() {
    setIsAdmin(false);
    localStorage.removeItem('nasa_admin');
  }

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
