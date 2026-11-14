import { Chapter } from "ApiDataTypes";
import { post, del, patch } from "@/lib/axios";

const craeteData = async (
  params: {
    name: string,
    lessonId: number,
    parentId?: number,
    number: number,
  }
) => {
  type Return = {
    rows: Chapter
  }
  const { data } = await post<Return>('/chapters/create', params);
  return data;
};

const updateData = async (params: {
  name: string,
  lessonId: number,
  chapterId: number,
}) => {
  type Return = {
    rows: Chapter[]
  }
  const { data } = await patch<Return>('/chapters/update', params);
  return data;
};

const deleteData = async (
  params: {
    chapterId: number[],
  }
) => {
  type Return = {
    rows: Chapter[]
  }
  const { data } = await del<Return>('/chapters/delete', {
    data: {
      ids: params.chapterId
    },
  });
  return data;
};

export default function useChapters() {
  return {
    craeteData,
    updateData,
    deleteData,
  };
}
