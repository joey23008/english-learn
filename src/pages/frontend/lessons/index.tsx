import type { NextPage } from 'next';
import Head from 'next/head';
import { PAGE_TYPES, SITE_TITLE, IDX_FRONT_PAGE, PAGE_TYPES_NM, SORT_DIRECTIONS, IDX_ORD_DESC, STATUS, URL } from '@/consts';
import Layout from '@/components/organisms/Layout/Default';
import { useCallback, useEffect, useState } from 'react';
import { useGlobalProgress } from '@/hooks/useGlobalProgress';
import { SortDirectionsValue } from 'ConstTypes';
import { useRouter } from 'next/router';
import LessonList from '@/components/organisms/Frontend/Lessons/List';
import useLessons from '@/hooks/useLessons';
import { useError } from '@/hooks/useError';

export const SORT_FIELDS = ['name', 'created_at'] as const;

export type Condition = {
  page: number,
  sortField: typeof SORT_FIELDS[number],
  sortDirection: SortDirectionsValue,
}

const INIT_CONDITION: Condition = {
  page: 1,
  sortField: 'created_at',
  sortDirection: SORT_DIRECTIONS[IDX_ORD_DESC],
};

const LessonsPage: NextPage = () => {
  const router = useRouter();
  const {
    globalProgress,
    setGlobalProgress
  } = useGlobalProgress();
  const { setError } = useError();
  const { state: { lessons, total }, getPagenatedData } = useLessons();
  
  /** 検索条件 */
  const [condition, setCondition] = useState<Condition>(INIT_CONDITION); // レッスンデータの検索条件

  // ソートアイコンクリック時の処理
  const handleOnClickSortIcon = useCallback((id: string | null, order: SortDirectionsValue | null) => {
    setCondition(prev => (
      {
        ...prev,
        sortField: id as typeof SORT_FIELDS[number],
        sortDirection: order as SortDirectionsValue,
      }
    ));
  }, [setCondition]);

  // 検索条件の変更時にデータを再取得する
  useEffect(() => {
    (async () => {
      try {
        setGlobalProgress(true);
        await getPagenatedData(condition.page, condition.sortField, condition.sortDirection);
      } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (err.status === STATUS.UNAUTHORIZED) {
          router.push(URL.LOGIN);
        } else {
          setError(err);
        }
      } finally {
        setGlobalProgress(false);
      }
    })();
  }, [setError, router, condition, getPagenatedData, setGlobalProgress]);

  // ページネーションリンク押下時の処理
  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setCondition((prev) => {
      return {
        ...prev,
        page: value,
      };
    });
  }, [setCondition]);

  return (
    <Layout
      pageType={PAGE_TYPES[IDX_FRONT_PAGE]}
    >
      <section id="page-wrapper">
        <Head>
          <title>{`${SITE_TITLE} | ${PAGE_TYPES_NM[IDX_FRONT_PAGE]} - レッスンズ`}</title>
        </Head>
        <h1 className="page-title mb-[20px]">Lessons</h1>
        <LessonList
          lessonsData={{ lessons, total, loading: globalProgress }}
          condition={condition}
          onClickSortIcon={handleOnClickSortIcon}
          onPageChange={handlePageChange}
        />
      </section>
    </Layout>
  );
};
export default LessonsPage;