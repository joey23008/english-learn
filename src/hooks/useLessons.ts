import { useCallback, useContext } from "react";
import { Lesson } from "ApiDataTypes";
import { SORT_FIELDS } from "@/pages/api/lessons";
import { get, post, del } from "@/lib/axios";
import { SortDirectionsValue } from "ConstTypes";
import { LessonsContext, LessonsSetContext } from "@/providers/LessonsProvider";

const getPagenatedData = async (
  page: number,
  sortField: typeof SORT_FIELDS[number],
  sortDirection: SortDirectionsValue,
) => {
  type ResponseData = {
    rows: Lesson[],
    total: number,
  }
  const { data } = await get<ResponseData>('lessons', {
    params: {
      page,
      sortField,
      sortDirection,
    }
  });
  return data;
};

const craeteData = async (
  params: {
    name: string,
  },
) => {
  const { data } = await post<Lesson>('/lessons/create', params);
  return data;
};

const deleteData = async (ids: number[]) => {
  await del('/lessons/delete', {
    data: {
      ids
    },
  });
};

const getDataById = async (id: number) => {
  type ResponseData = {
    rows: Lesson[],
  }
  const { data } = await get<ResponseData>(`/lessons/${id}`);
  return data.rows;
};

export default function useLessons() {
  const state = useContext(LessonsContext);
  const setState = useContext(LessonsSetContext);
  
  if (!state || !setState) {
    throw new Error("The LessonsProvider is missing.");
  }

  const tmpGetDataById = useCallback(async (id: number) => {
    const data = await getDataById(id);
    setState((prev) => {
      return {
        ...prev,
        lessons: data,
      };
    });
    return data;
  }, [setState]);

  const tmpGetPagenatedData = useCallback(async (page: number, sortField: typeof SORT_FIELDS[number], sortDirection: SortDirectionsValue) => {
    const data = await getPagenatedData(
      page,
      sortField,
      sortDirection,
    );
    setState((prev) => {
      return {
        ...prev,
        lessons: data.rows,
        total: data.total,
      };
    });
  }, [setState]);

  return {
    state,
    getDataById: tmpGetDataById,
    getPagenatedData: tmpGetPagenatedData,
    craeteData,
    deleteData,
  };
}