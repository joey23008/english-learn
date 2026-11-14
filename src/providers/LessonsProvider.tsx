
import { Lesson } from "ApiDataTypes";
import {createContext, Dispatch, SetStateAction, useState} from "react";

type StateType = {
  lessons: Lesson[],
  total: number,
}
const initialState = {
  lessons: [],
  total: 0,
};

export const LessonsContext = createContext<StateType | null>(null);
export const LessonsSetContext = createContext<Dispatch<SetStateAction<StateType>> | null>(null);

type Props = {
  children: React.ReactNode,
}
export function LessonsProvider ({children}: Props) {
  const [state, setState] = useState<StateType>(initialState);

  return (
    <LessonsContext.Provider value={state}>
      <LessonsSetContext.Provider value={setState}>
      {children}
      </LessonsSetContext.Provider>
    </LessonsContext.Provider>
  );
}