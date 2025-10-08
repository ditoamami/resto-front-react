import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    // try to fetch current user (optional: endpoint /user)
    const loadUser = async ()=>{
      try {
        const res = await axiosClient.get('/user');
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  },[]);

  const login = async (email, password) => {
    // Example login for Sanctum: fetch CSRF cookie first
    await axiosClient.get('/sanctum/csrf-cookie');
    const res = await axiosClient.post('/login', { email, password });
    // After login, you may GET /user to retrieve info
    const userRes = await axiosClient.get('/user');
    setUser(userRes.data);
    return res;
  };

  const logout = async ()=>{
    await axiosClient.post('/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
