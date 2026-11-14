import {createContext, Dispatch, SetStateAction, useState} from "react";

export const GlobalProgressContext = createContext(false);
export const GlobalProgressSetContext = createContext<Dispatch<SetStateAction<boolean>> | null>(null);

type Props = {
  children: React.ReactNode,
}
export function GlobalProgressProvider ({children}: Props) {
  const [globalProgress, setGlobalProgress] = useState(false);

  return (
    <GlobalProgressContext.Provider value={globalProgress}>
      <GlobalProgressSetContext.Provider value={setGlobalProgress}>
      {children}
      </GlobalProgressSetContext.Provider>
    </GlobalProgressContext.Provider>
  );
}