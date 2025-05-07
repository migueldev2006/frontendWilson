import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { User } from "@/types/Usuario";


type Auth = {
  authenticated: boolean | undefined;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  nombre: string | undefined;
  setNombre: React.Dispatch<React.SetStateAction<string | undefined>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<Auth | null>(null);

export const useAuth = () => useContext(AuthContext) as Auth;

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | undefined>(undefined);
  const [nombre, setNombre] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);

  const cookies = new Cookies();

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      const decoded: User = jwtDecode(token);
      setUser(decoded);
      setNombre(`${decoded.nombre} ${decoded.apellido}`);
      setAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, nombre, setNombre, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
