import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Laging isama ang token sa request
  useEffect(() => {
    if (adminToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
      localStorage.setItem('adminToken', adminToken);
      setIsAdmin(true);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('adminToken');
      setIsAdmin(false);
    }
    setLoading(false);
  }, [adminToken]);

  // Admin Login
  const adminLogin = async (email, password) => {
    const res = await axios.post('/api/admin/login', { email, password });
    setAdminToken(res.data.token);
    return res.data;
  };

  // Admin Logout
  const adminLogout = () => {
    setAdminToken('');
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{
      isAdmin,
      adminToken,
      loading,
      adminLogin,
      adminLogout
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
