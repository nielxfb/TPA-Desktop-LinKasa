import { ReactNode, createContext, useContext, useState } from 'react';
import { AuthContextProps } from './AuthContextProps';
import { User } from './User';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// eslint-disable-next-line react/prop-types
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
