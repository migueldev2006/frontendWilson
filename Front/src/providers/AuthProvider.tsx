import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from 'jwt-decode'

type Auth = {
    authenticated : boolean | undefined,
    setAuthenticated : React.Dispatch<React.SetStateAction<boolean | undefined>>,
    nombre : string | undefined,
    setNombre : React.Dispatch<React.SetStateAction<string | undefined>>
}

const AuthContext = createContext<Auth | null>(null);

export const useAuth = () => useContext(AuthContext) as Auth;

export default function AuthProvider({children}:{children : React.ReactNode}) {
    
    const [authenticated, setAuthenticated] = useState<boolean | undefined>(undefined)
    const [nombre,setNombre] = useState<string | undefined>(undefined);
    
    const cookies = new Cookies();
    
    useEffect(()=>{
        const token = cookies.get("token");
        if(token){
            const {nombre,apellido} : {nombre : string,apellido : string}= jwtDecode(token);
            setNombre(`${nombre} ${apellido}`);
            setAuthenticated(true);
        }    
    },[])
    
    return(
        <AuthContext.Provider value={{authenticated,setAuthenticated,nombre,setNombre}}>
            {children}
        </AuthContext.Provider>
    )
}