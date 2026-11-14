import { useCallback, useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useGlobalProgress } from '@/hooks/useGlobalProgress';
import Layout from '@/components/organisms/Layout/Default';
import { Resizable } from 're-resizable';
import { PAGE_TYPES_NM, SITE_TITLE, STATUS, URL } from '@/consts';
import styles from './styles.module.scss';
import { useError } from '@/hooks/useError';
import EditableContent from '@/components/organisms/Dashboard/Lessons/Edit/EditableContent';
import { OrderedSentences } from 'ApiDataTypes';
import { get } from '@/lib/axios';
import { EL_TYPE, TYPE_CHAP_IDX } from '@/components/organisms/Dashboard/Lessons/Edit/EditableContent/Insert/Menu';
import type { OnSubmitParams } from '@/components/organisms/Dashboard/Lessons/Edit/EditableContent/DammyCrItem/Index';
import OrderedSentencesNav, { getNavData } from '@/components/organisms/OrderedSentencesNav';
import { useFillSpaceBelow } from '@/hooks/useFillSpaceBelow';
import { PAGE_TYPES, IDX_DASH_PAGE } from '@/consts';
import Utils from '@/components/organisms/OrderedSentencesUtils';
import useLessons from '@/hooks/useLessons';
import useChapters from '@/hooks/useChapters';
import useQuestions from '@/hooks/useQuestions';

export type UtilsMeta = {
  toggle: {
    isExpanded: boolean,
  },
}
const INIT_UTILS_META: UtilsMeta = {
  toggle: {
    isExpanded: false,
  }
};

const LessonsEditPage: NextPage = () => {
  const router = useRouter();
  const { setError } = useError();
  const { globalProgress, setGlobalProgress } = useGlobalProgress();
  const { state: { lessons }, getDataById } = useLessons();
  const { craeteData : craeteChapter, updateData: updateChapter, deleteData: deleteChapter } = useChapters();
  const { craeteData : createQuestion, updateData: updateQuestion, deleteData: deleteQuestion } = useQuestions();
  const lessonId = useMemo(() => router.query.id ? Number(router.query.id) : undefined, [router.query.id]);
  const lesson = lessons[0];
  const { orderedSentences, withDammy, getOrderedSentences, insertDammyCrItem, deleteCrDammyItem } = useOrderedSentences(); // 問題データの操作関連
  const navData = useMemo(() => getNavData(orderedSentences), [orderedSentences]);
  const { fillTargetRef} = useFillSpaceBelow<HTMLDivElement>();

  // 問題データを取得する
  useEffect(() => {
    (async () => {
      if (lessonId) {
        try {
          setGlobalProgress(true);
          const result = await getDataById(lessonId);
          if (result.length === 0) {
            router.push('/404');
          } else {
            await getOrderedSentences(lessonId);
          }
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
          if (err.status === STATUS.UNAUTHORIZED) {
            router.push(URL.LOGIN);
          } else {
            setError(err);
          }
        } finally {
          setGlobalProgress(false);
        }
      }
    })();
  }, [setError, router, lessonId, getDataById, getOrderedSentences, setGlobalProgress]);
  
  type Size = {
    width: number,
  }
  const [leftSize, setLeftSize] = useState<Size>({
    width: 150
  });

  // ダミーアイテム登録時の処理
  const handleOnDammyCrSubmit = useCallback(async ({
    value,
    parent,
    number,
    type,
  }: OnSubmitParams) => {
    if (lessonId) {
      const idxs = findIndexRecursive(withDammy, DAMMY_CR_ID) as number[];
      if (value === '') {
        deleteCrDammyItem(idxs);
      } else {
        setGlobalProgress(true);
        if (type === EL_TYPE[TYPE_CHAP_IDX]) {
          await craeteChapter({
            name: value,
            lessonId: lessonId as number,
            parentId: parent ?? undefined,
            number,
          });
        } else {
          await createQuestion({
            userNumber: value,
            lessonId: lessonId as number,
            chapterId: parent ?? undefined,
            number,
          });
        }
        await getOrderedSentences(lessonId);
        setGlobalProgress(false);
      }
    }
  }, [lessonId, deleteCrDammyItem, getOrderedSentences, withDammy, setGlobalProgress, craeteChapter, createQuestion]);

  // チャプター更新時の処理
  const handleOnUpdateChapter = useCallback(async (params: OnUpdateChapterParams) => {
    try {
      setGlobalProgress(true);
      await updateChapter({
        ...params,
        lessonId: lessonId as number,
      });
      await getOrderedSentences(lessonId as number);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (err.status === STATUS.UNAUTHORIZED) {
        router.push(URL.LOGIN);
      } else {
        setError(err);
      }
    } finally {
      setGlobalProgress(false);
    }
  }, [setError, getOrderedSentences,router, lessonId, setGlobalProgress, updateChapter]);

  // チャプター削除時の処理
  const handleOnDeleteChapter = useCallback(async (params: OnDeleteChapterParams) => {
    try {
      setGlobalProgress(true);
      await deleteChapter({
        chapterId: [params.chapterId],
      });
      await getOrderedSentences(lessonId as number);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (err.status === STATUS.UNAUTHORIZED) {
        router.push(URL.LOGIN);
      } else {
        setError(err);
      }
    } finally {
      setGlobalProgress(false);
    }
  }, [setError, getOrderedSentences,router, lessonId, setGlobalProgress, deleteChapter]);

  // クエスチョン更新時の処理
  const handleOnUpdateQuestion = useCallback(async (params: OnUpdateQuestionParams) => {
    try {
      setGlobalProgress(true);
      await updateQuestion({
        ...params,
        lessonId: lessonId as number,
      });
      await getOrderedSentences(lessonId as number);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (err.status === STATUS.UNAUTHORIZED) {
        router.push(URL.LOGIN);
      } else {
        setError(err);
      }
    } finally {
      setGlobalProgress(false);
    }
  }, [setError, getOrderedSentences,router, lessonId, setGlobalProgress, updateQuestion]);

  // クエスチョン削除時の処理
  const handleOnDeleteQuestion = useCallback(async (params: OnDeleteQuestionParams) => {
    try {
      setGlobalProgress(true);
      await deleteQuestion({
        questionIds: [params.questionId],
      });
      await getOrderedSentences(lessonId as number);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (err.status === STATUS.UNAUTHORIZED) {
        router.push(URL.LOGIN);
      } else {
        setError(err);
      }
    } finally {
      setGlobalProgress(false);
    }
  }, [setError, getOrderedSentences,router, lessonId, setGlobalProgress, deleteQuestion]);
  
  // ユーティリティメニューの状態値
  const [utilsMeta, setUtilsMeta] = useState(INIT_UTILS_META);
  const handleOnClickToggle = () => {
    setUtilsMeta(prev => {
      return ({
        toggle: {
          isExpanded: !prev.toggle.isExpanded,
        }
      });
    });
  };

  return (
    <Layout
      pageType={PAGE_TYPES[IDX_DASH_PAGE]}
    >
      <section id="page-wrapper">
        <Head>
          <title>{`${SITE_TITLE} | ${PAGE_TYPES_NM[IDX_DASH_PAGE]} - レッスン編集 - ${lessonId}`}</title>
        </Head>
        <div className='relative'>
          <h1 className="page-title mb-[20px]">{lesson?.name}</h1>
          <Utils
            className={styles['utils']}
            meta={utilsMeta}
            onClickToggle={handleOnClickToggle}
          />
        </div>
        <div className='flex overflow-y-auto' ref={fillTargetRef}>
          <Resizable
            className={styles['ordered-sentence-nav']}
            size={leftSize}
            onResizeStop={(_e, _direction, _ref, d) => {
              setLeftSize(prev => ({
                width: prev.width + d.width,
              }));
            }}
            enable={{
              top: false,
              right: true,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
          >
            <OrderedSentencesNav
              listData={navData}
              loading={globalProgress}
            />
          </Resizable>
          <EditableContent
            className={styles['editable-content']}
            orderedSentences={withDammy}
            // parentIdxs={PARENT_IDXS}
            onAddCrItem={insertDammyCrItem}
            onDammyCrSubmit={handleOnDammyCrSubmit}
            // loading={globalProgress}
            onUpdateChapter={handleOnUpdateChapter}
            onDeleteChapter={handleOnDeleteChapter}
            lessonId={lessonId}
            getOrderedSentences={getOrderedSentences}
            onUpdateQuestion={handleOnUpdateQuestion}
            onDeleteQuestion={handleOnDeleteQuestion}
            chapterTitleOpen={utilsMeta.toggle.isExpanded}
          />
        </div>
      </section>
    </Layout>
  );
};
export default LessonsEditPage;

export const DAMMY_CR_ID = 'DAMMY_CR';
const DAMMY_CR_DATA = {
  lesson_sentence_id: DAMMY_CR_ID,
  type: '' as (typeof EL_TYPE)[number],
  number: 0 as number,
  parent: null as number | null,
} as const;
export type OrderedSentencesOrDammy = (OrderedSentences | typeof DAMMY_CR_DATA)

function useOrderedSentences() {
  const [orderedSentences, setOrderedSentences] = useState<OrderedSentences[]>([]);
  const [withDammy, setWithDammy] = useState<OrderedSentencesOrDammy[]>([]);

  // 更新されたクエスチョンデータをダミーデータにコピーする
  useEffect(() => {
    setWithDammy(orderedSentences);
  }, [orderedSentences]);

  // クエスチョンデータを取得する
  const getOrderedSentences = useCallback(async (id: number) => {
    type ResponseData = {
      rows: OrderedSentences[],
    }
    const { data } = await get<ResponseData>(`/lessons/${id}/ordered_sentences`);
    setOrderedSentences(data.rows);
    return data.rows;
  }, [setOrderedSentences]);

  // 新規追加用ダミーデータを追加する。
  const insertDammyCrItem = useCallback(({ type, lessonSentenceId, action }: CrItemParams) => {
    setWithDammy(prev => {
      let idxs = [0];
      let number = 1;
      let parent = null;
      if (lessonSentenceId && action) {
        const source = prev as OrderedSentences[];
        idxs = findIndexRecursive(source, lessonSentenceId) as number[];
        const matched = getDataByPath(source, idxs) as OrderedSentences;
        if (action === INSRT_ACTS[IDX_NEXT]) {
          idxs[idxs.length - 1] = idxs[idxs.length - 1] + 1;
          number = getNextNumber(matched);
          parent = matched.parent;
        } else {
          idxs = [...idxs, 0];
          number = matched.number + 1;
          parent = matched.chapter_id;
        }
      }
      
      const newObj = {
        ...DAMMY_CR_DATA,
        type,
        number,
        parent,
      };

      return updateSourcesRecursive(
        JSON.parse(JSON.stringify(prev)) as OrderedSentences[],
        idxs,
        (parent: OrderedSentencesOrDammy[], idx) => {
          parent.splice(idx, 0, newObj);
          return parent;
        }
      );;
    });
  }, [setWithDammy]);

  // ダミーデータを削除する
  const deleteCrDammyItem = useCallback((idxs: number[]) => {
    setWithDammy(prev => {
      return updateSourcesRecursive(
        JSON.parse(JSON.stringify(prev)) as OrderedSentences[],
        idxs,
        (parent: OrderedSentencesOrDammy[], idx) => {
          parent.splice(idx, 1);
          return parent;
        }
      );;
    });
  }, [setWithDammy]);

  return {
    orderedSentences,
    withDammy,
    getOrderedSentences,
    insertDammyCrItem,
    deleteCrDammyItem,
  };
}

const getNextNumber = (source: OrderedSentences) => {
  if (Array.isArray(source.children) && source.children.length > 0) {
    return getNextNumber(source.children[source.children.length - 1]);
  } else {
    return source.number + 1;
  }
};

/**
 * インデックスパスを使用してデータを取得する
 * @param sentences 検索対象のOrderedSentences配列
 * @param path インデックスパス（例: [1, 1, 0]）
 * @returns インデックスに対応するデータ
 */
function getDataByPath(sentences: OrderedSentences[], path: number[]) {
  let current = sentences;
  for (let i = 0; i < path.length; i++) {
    const index = path[i];
    if (!current[index]) {
      return null; // パスが不正な場合
    }
    if (i === path.length - 1) {
      return current[index]; // 最後のインデックスに到達した場合
    }
    current = current[index].children || []; // 次の階層へ
  }
  return null; // パスが途中で切れる場合
}

/**
 * 配列から一致するlesson_sentence_idのインデックスを検索する
 * @param sentences 検索対象のOrderedSentences配列
 * @param targetId 検索したいlesson_sentence_id
 * @returns 一致するインデックスの配列。見つからない場合はnull
 */
function findIndexRecursive(
  sentences: OrderedSentencesOrDammy[],
  targetId: number | string,
  path: number[] = []
): number[] | null {
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i] as OrderedSentences;
    if (sentence.lesson_sentence_id === targetId) {
      return [...path, i]; // 現在のパスを返す
    }
    if (sentence.children) {
      const childResult = findIndexRecursive(sentence.children, targetId, [...path, i]);
      if (childResult !== null) {
        return childResult; // 子で見つかった場合
      }
    }
  }
  return null; // 見つからない場合
}

function updateSourcesRecursive(sources: OrderedSentences[], idxs: number[], cb: (parent: OrderedSentences[], idx: number) => OrderedSentencesOrDammy[]): OrderedSentencesOrDammy[] {
  // ベースケース：idxsが空なら、新しいオブジェクトを追加した配列を返す
  if (idxs.length === 1) {
    if (!Array.isArray(sources)) {
      throw new Error("Target is not an array");
    }
    const copy: OrderedSentences[] = JSON.parse(JSON.stringify(sources));
    return cb(copy, idxs[0]);
  }

  // 現在のインデックスを取得
  const [currentIdx, ...restIdxs] = idxs;

  // 配列やオブジェクトを安全にコピーして再帰的に進む
  if (Array.isArray(sources)) {
    return sources.map((item, idx) =>
      idx === currentIdx
        ? {
          ...item,
          children: updateSourcesRecursive(item.children as OrderedSentences[], restIdxs, cb),
        }
        : item
    ) as OrderedSentencesOrDammy[];
  }

  throw new Error("Invalid path: Expected an array but got something else");
}

export const INSRT_ACTS = ['next', 'first'] as const;
export const IDX_NEXT = 0;
export const IDX_FIRST = 1;
export type InsertAction = (typeof INSRT_ACTS)[number]

export type CrItemParams = {
  type: (typeof EL_TYPE)[number],
  lessonSentenceId?: number, 
  action?: InsertAction,
}

export type OnUpdateChapterParams = {
  name: string,
  chapterId: number,
}

export type OnDeleteChapterParams = {
  chapterId: number,
}

export type OnUpdateQuestionParams = {
  userNumber: string,
  questionId: number,
}

export type OnDeleteQuestionParams = {
  questionId: number,
}

export type OnUpdateSentenceParams = {
  id: number,
  content: string,
  answer: string,
}

export type OnCreateSentenceParams = {
  content: string,
  answer: string,
  lessonId: number,
  questionId: number,
}

export type OnDeleteSentenceParams = {
  id: number,
}