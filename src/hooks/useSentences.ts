import { Sentence } from "ApiDataTypes";
import { post, del, patch } from "@/lib/axios";

const createData = async (
  params: {
    content: string,
    answer: string,
    lessonId: number,
    questionId: number,
  }
) => {
  type Return = {
    rows: Sentence[]
  }
  const { data } = await post<Return>('/sentences/create', params);
  return data.rows;
};

const deleteData = async (
  params: {
    id: number,
  }
) => {
  await del('/sentences/delete', {
    data: params,
  });
};

const updateData = async (
  params: {
    id: number,
    content: string,
    answer: string,
  },
) => {
  type Return = {
    rows: Sentence[]
  }
  const { data } = await patch<Return>('/sentences/update', params);
  return data.rows;
};

export default function useSentences() {
  return {
    createData,
    deleteData,
    updateData,
  };
};
