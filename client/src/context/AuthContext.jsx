import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Laging isama ang token sa request
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Kunin ang impormasyon ng user kapag may token
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/user/me');
        setUser(res.data.user);
      } catch (err) {
        setToken('');
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  // MAG-REGISTER
  const register = async (name, email, password) => {
    const res = await axios.post('/api/auth/register', { name, email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // MAG-LOGIN
  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // MAG-LOGOUT
  const logout = () => {
    setToken('');
    setUser(null);
  };

  // I-refresh ang impormasyon ng user
  const refreshUser = async () => {
    if (!token) return;
    const res = await axios.get('/api/user/me');
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      register,
      login,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
