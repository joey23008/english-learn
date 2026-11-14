import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { IDX_DASH_PAGE, IDX_ORD_DESC, MSG_SUC, PAGE_TYPES, PAGE_TYPES_NM, SITE_TITLE, SORT_DIRECTIONS, STATUS, URL } from '@/consts';
import styles from './styles.module.scss';
import Layout from '@/components/organisms/Layout/Default';
import Lessons from '@/components/organisms/Dashboard/Lessons/List';
import CreateDlg, { useCreateDlg } from '@/components/organisms/Dashboard/Lessons/List/CreateDlg';
import { Condition } from '@/components/organisms/Dashboard/Lessons/List';
import Alert from '@/components/atoms/Alert';
import { SortDirectionsValue } from 'ConstTypes';
import { SORT_FIELDS } from '@/pages/api/lessons';
import { msgFormat } from '@/utils';
import { Lesson } from 'ApiDataTypes';
import { useGlobalProgress } from '@/hooks/useGlobalProgress';
import useLessons from '@/hooks/useLessons';
import { useError } from '@/hooks/useError';

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
  const { state: { lessons, total }, getPagenatedData, craeteData, deleteData } = useLessons();
  const [successAlert, setSuccessAlert] = useState<string | null>(null);

  const [
    condition,
    handleOnClickSortIcon,
    checkAll,
    setCheckAll,
    checkedIds,
    handleCheckAll,
    handleOnCheck,
    handlePageChange,
  ] = useLessonList(lessons);

  const [
    dlgOpen,
    handleOnOpen,
    handleOnClose,
  ] = useCreateDlg();

  const getData = useCallback(async () => {
    await getPagenatedData(condition.page, condition.sortField, condition.sortDirection);
    setCheckAll(false);
  }, [condition, setCheckAll, getPagenatedData]);

  // 検索条件の変更時にデータを再取得する
  useEffect(() => {
    (async () => {
      try {
        setGlobalProgress(true);
        await getData();
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
  }, [getData, setError, router, setGlobalProgress]);

  // 新規作成押下時の処理
  const handleOnSubmit = useCallback(async (params: { name: string }) => {
    try {
      setGlobalProgress(true);
      setSuccessAlert('');
      handleOnClose();
      const lesson = await craeteData(params);
      setSuccessAlert(msgFormat(MSG_SUC.CR_DONE, 'id', lesson.id));
      getData();
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(err);
    } finally {
      setGlobalProgress(false);
    }
  }, [setSuccessAlert, handleOnClose, getData, setError, setGlobalProgress, craeteData]);

  const handleOnClickDelete = useCallback(async () => { // 一括削除押下時の処理
    setGlobalProgress(true);
    setSuccessAlert('');
    await deleteData(checkedIds);
    getData();
    setGlobalProgress(false);
  }, [checkedIds, getData, setGlobalProgress, deleteData]);
  
  return (
    <Layout
      pageType={PAGE_TYPES[IDX_DASH_PAGE]}
    >
      <section id="page-wrapper">
        <Head>
          <title>{`${SITE_TITLE} | ${PAGE_TYPES_NM[IDX_DASH_PAGE]} - レッスンズ`}</title>
        </Head>
        <h1 className="page-title mb-[20px]">Lessons</h1>
        {
          successAlert ? <Alert severity="success">{successAlert}</Alert> : null
        }
        <Lessons
          className={styles.lessons}
          lessonsData={{
            lessons,
            total,
            loading: globalProgress,
          }}
          condition={condition}
          onClickSortIcon={handleOnClickSortIcon}
          onPageChange={handlePageChange}
          onClickCreate={handleOnOpen}
          onClickDelete={handleOnClickDelete}
          checkAll={checkAll}
          onCheckAll={handleCheckAll}
          checkedIds={checkedIds}
          onCheck={handleOnCheck}
        />
        <CreateDlg
          open={dlgOpen}
          onClickClose={handleOnClose}
          onSubmit={handleOnSubmit}
        />
      </section>
    </Layout>
  );
};
export default LessonsPage;

function useLessonList(
  lessons: Lesson[]
) {
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

  /** チェックボックス */
  const [checkAll, setCheckAll] = useState<boolean>(false); // 一括チェックフラグ
  const [checkedIds, setCheckedIds] = useState<number[]>([]); // 行チェックフラグ

  const handleCheckAll = useCallback(() => { // 一括チェック押下時の処理
    setCheckAll(prev => !prev);
  }, [setCheckAll]);

  useEffect(() => { // 一括チェック変更時の処理
    let newState: number[] = [];
    if (checkAll) {
      newState = lessons.map(v => v.id);
    }
    setCheckedIds(newState);
  }, [checkAll, setCheckedIds, lessons]);

  const handleOnCheck = useCallback((tmpId: number | string) => { // 行チェックフラグ
    setCheckedIds((prev) => {
      const id = tmpId as number;
      const idx = prev.indexOf(id);
      let newState = null;
      if (idx !== -1) {
        newState = prev.filter(v => v !== id);
      } else {
        newState = [
          ...prev,
          id,
        ];
      }
      return newState;
    });
  }, [setCheckedIds]);

  // 検索条件変更時の処理
  useEffect(() => {
    // 一括チェックを解除する
    setCheckAll(prev => {
      let nextState = prev;
      if (prev) {
        nextState = false;
      }
      return nextState;
    });
  }, [condition, setCheckAll]);

  // レッスン情報・検索条件が変化した際の処理
  useEffect(() => {
    // データ削除後にページ範囲外になった場合は１ページ目に移動する
    setCondition(prev => {
      let nextState = prev;
      if (lessons.length === 0 && prev.page > 1) {
        nextState = {
          ...prev,
          page: 1,
        };
      }
      return nextState;
    });
  }, [lessons, setCondition]);

  // ページネーションリンク押下時の処理
  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setCondition((prev) => {
      return {
        ...prev,
        page: value,
      };
    });
  }, [setCondition]);

  return [
    condition,
    handleOnClickSortIcon,
    checkAll,
    setCheckAll,
    checkedIds,
    handleCheckAll,
    handleOnCheck,
    handlePageChange,
  ] as const;
}