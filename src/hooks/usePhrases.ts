import { useCallback, useState } from "react";
import { Phrase } from "ApiDataTypes";
import { get } from "@/lib/axios";

type State = {
  phrases: Phrase[],
}

const initialState = {
  phrases: [],
};

const getPartialMatch = async (
  params: {
    keyword: string,
  },
) => {
  type Return = {
    rows: Phrase[]
  }
  const { data } = await get<Return>(`/phrases/partial_match?keyword=${params.keyword}`);
  return data.rows;
};

export default function usePhrases() {
  const [state, setState] = useState<State>(initialState);

  const reset = useCallback(() => {
    setState(initialState);
  }, [setState]);

  type PartialMatchParams = {
    keyword: string,
  }
  
  const tmpGetPartialMatch = useCallback(async ({ keyword }: PartialMatchParams) => {
    const data = await getPartialMatch({
      keyword,
    });
    setState(prev => ({
      ...prev,
      phrases: data,
    }));
  }, [setState]);

  return {
    state,
    reset,
    getPartialMatch: tmpGetPartialMatch,
  };
}