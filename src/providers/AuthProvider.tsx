import { User } from "ApiDataTypes";
import {createContext, Dispatch, SetStateAction, useState} from "react";

export const AuthContext = createContext<User | null>(null);
export const AuthSetContext = createContext<Dispatch<SetStateAction<User | null>>>(() => {});

type Props = {
  children: React.ReactNode,
}
export function AuthProvider ({children}: Props) {
  const [me, setMe] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={me}>
      <AuthSetContext.Provider value={setMe}>
      {children}
      </AuthSetContext.Provider>
    </AuthContext.Provider>
  );
}