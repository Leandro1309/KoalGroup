import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  user: { username: string; role: 'administrador' | 'supervisor'; idSupervisor?: number } | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Recuperar sesión si existe
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    // Aquí deberías hacer la petición real al backend
    // Simulación:
    if (username === 'admin') {
      setUser({ username, role: 'administrador' });
      setToken('fake-admin-token');
      localStorage.setItem('token', 'fake-admin-token');
      localStorage.setItem('user', JSON.stringify({ username, role: 'administrador' }));
    } else if (username === 'supervisor1') {
      setUser({ username, role: 'supervisor', idSupervisor: 1 });
      setToken('fake-supervisor1-token');
      localStorage.setItem('token', 'fake-supervisor1-token');
      localStorage.setItem('user', JSON.stringify({ username, role: 'supervisor', idSupervisor: 1 }));
    } else if (username === 'supervisor2') {
      setUser({ username, role: 'supervisor', idSupervisor: 2 });
      setToken('fake-supervisor2-token');
      localStorage.setItem('token', 'fake-supervisor2-token');
      localStorage.setItem('user', JSON.stringify({ username, role: 'supervisor', idSupervisor: 2 }));
    } else {
      throw new Error('Credenciales inválidas');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
