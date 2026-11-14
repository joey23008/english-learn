import { Question } from "ApiDataTypes";
import { post, del, patch } from "@/lib/axios";

const craeteData = async (
  params: {
    userNumber: string,
    lessonId: number,
    chapterId?: number,
    number: number,
  }
) => {
  type Return = {
    rows: Question
  }
  const { data } = await post<Return>('/questions/create', params);
  return data;
};

const updateData = async (
  params: {
    userNumber: string,
    lessonId: number,
    questionId: number,
  },
) => {
  type Return = {
    rows: Question[]
  }
  const { data } = await patch<Return>('/questions/update', params);
  return data;
};

const deleteData = async (
  params: {
    questionIds: number[],
  },
) => {
  type Return = {
    rows: Question[]
  }
  const { data } = await del<Return>('/questions/delete', {
    data: {
      ids: params.questionIds
    },
  });
  return data;
};

export default function useQuestions() {
  return {
    craeteData,
    updateData,
    deleteData,
  };
}
