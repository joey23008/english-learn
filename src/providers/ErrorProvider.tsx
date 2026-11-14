
import {createContext, Dispatch, SetStateAction, useState} from "react";

export type CustomError = {
  message: string | undefined, 
  stack: string | undefined, 
  name: string | undefined,
  status: number | undefined,
  request: boolean | undefined
}
export const ErrorContext = createContext<CustomError | null>(null);
export const ErrorSetContext = createContext<Dispatch<SetStateAction<CustomError | null>> | null>(null);

type Props = {
  children: React.ReactNode,
}
export function ErrorProvider ({children}: Props) {
  const [error, setError] = useState<CustomError | null>(null);

  return (
    <ErrorContext.Provider value={error}>
      <ErrorSetContext.Provider value={setError}>
      {children}
      </ErrorSetContext.Provider>
    </ErrorContext.Provider>
  );
}