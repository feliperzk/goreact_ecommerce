import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Definição do tipo de usuário
type User = {
  id: string;
  name: string;
  email: string;
};

// Interface do contexto de autenticação
type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
};

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuário mockado para desenvolvimento
const mockUser = {
  id: 'user123',
  name: 'Usuário Teste',
  email: 'usuario@teste.com'
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Estados para gerenciar autenticação
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar se o usuário já está logado ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Em uma aplicação real, verificaríamos o token com o backend
      // Para desenvolvimento, apenas simula um usuário logado
      setUser(mockUser);
    }
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulando um tempo de resposta
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock de validação simples para desenvolvimento
      if (email === 'usuario@teste.com' && password === '123456') {
        const token = 'mock-jwt-' + Math.random().toString(36).substring(2);
        localStorage.setItem('token', token);
        setUser(mockUser);
      } else {
        throw new Error('Email ou senha incorretos');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  // Função de registro
  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulando um tempo de resposta
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Criar um novo usuário (mock)
      const newUser = {
        id: 'user-' + Date.now(),
        name,
        email
      };
      
      const token = 'mock-jwt-' + Math.random().toString(36).substring(2);
      localStorage.setItem('token', token);
      setUser(newUser);
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Verifica se o usuário está autenticado
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}; 