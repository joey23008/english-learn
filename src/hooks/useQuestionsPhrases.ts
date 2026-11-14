import { Phrase, QuestionsPhrase } from "ApiDataTypes";
import { post, del, patch } from "@/lib/axios";

const createData = async (
  params: {
    phraseId?: number,
    en?: string,
    jp?: string,
    lessonId?: number,
    questionId?: number,
    priority?: number,
  }
) => {
  type Return = {
    rows: Phrase[]
  }
  const { data } = await post<Return>('/questions_phrases/create', params);
  return data.rows;
};

const deleteData = async (
  params: {
    lessonId: number,
    questionId: number,
    qsPhrIds: number[],
    deleteMasterData?: boolean,
  },
) => {
  await del('/questions_phrases/delete', {
    data: params,
  });
};

const updateData = async (
  params: {
    id: number,
    phraseId: number,
    en: string,
    jp: string,
    priority: number,
  },
) => {
  type Return = {
    phrases: Phrase[],
    questionsPhrases: QuestionsPhrase[],
  }
  const { data } = await patch<Return>('/questions_phrases/update', params);
  return data;
};

export default function useQuestionsPhrases() {
  return {
    createData,
    deleteData,
    updateData,
  };
}
