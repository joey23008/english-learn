import { useCallback, useState } from "react";
import { Response } from "ApiDataTypes";
import { patch, get, del } from "@/lib/axios";

type State = {
  responses: Response[],
}

const initialState = {
  responses: [],
};

const getDataByLessonId = async (lessonId: number) => {
  type Return = {
    rows: Response[],
  }
  const { data } = await get<Return>(`/responses?lessonId=${lessonId}`);
  return data.rows;
};

const updateData = async (
  params: {
    content: string,
    lessonId: number,
    sentenceId: number,
  },
) => {
  type Return = {
    rows: Response[]
  }
  const { data } = await patch<Return>('/responses/update', params);
  return data.rows;
};

const deleteData = async (id: number) => {
  await del('/responses/delete', {
    data: {
      id
    },
  });
};

export default function useResponses() {
  const [state, setState] = useState<State>(initialState);

  const tmpGetDataByLessonId = useCallback(async (lessonId: number) => {
    const data = await getDataByLessonId(lessonId);
    setState((prev) => {
      return {
        ...prev,
        responses: data,
      };
    });
  }, [setState]);

  return {
    state,
    getDataByLessonId: tmpGetDataByLessonId,
    updateData,
    deleteData,
  };
};
