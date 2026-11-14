import { useCallback, useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useGlobalProgress } from '@/hooks/useGlobalProgress';
import Layout from '@/components/organisms/Layout/Default';
import { Resizable } from 're-resizable';
import { IDX_FRONT_PAGE, PAGE_TYPES_NM, PRIORITIES, SITE_TITLE, STATUS, URL } from '@/consts';
import styles from './styles.module.scss';
import { OrderedSentences, Sentence, Response } from 'ApiDataTypes';
import { get } from '@/lib/axios';
import OrderedSentencesNav, { getNavData } from '@/components/organisms/OrderedSentencesNav';
import { useFillSpaceBelow } from '@/hooks/useFillSpaceBelow';
import { PAGE_TYPES, IDX_DASH_PAGE } from '@/consts';
import Questions from '@/components/organisms/Frontend/Lessons/Detail/Questions';
import Utils from '@/components/organisms/OrderedSentencesUtils';
import { OnUpdateParams as OnUpdateRespParams } from '@/components/organisms/Frontend/Lessons/Detail/Questions/QuestionItem/SentenceItem';
import NoInputNav from '@/components/organisms/Frontend/Lessons/Detail/NoInputNav';
import useLessons from '@/hooks/useLessons';
import useResponses from '@/hooks/useResponses';
import { useError } from '@/hooks/useError';
import Button from '@/components/atoms/Button';
import classNames from 'classnames';
import ConfirmDeleteRespDlg, { useConfirmDeleteRespDlg } from '@/components/organisms/Frontend/Lessons/Detail/ConfirmDeleteResDlg';

export type QsData = (OrderedSentences & {
  sentences: (Sentence & {
    response?: string,
  })[],
  children?: QsData
})[]

export type UtilsMeta = {
  answer: {
    active: boolean,
  },
  phrase: {
    priorities: number[],
  },
  toggle: {
    isExpanded: boolean,
  },
}
const INIT_UTILS_META: UtilsMeta = {
  answer: {
    active: false,
  },
  phrase: {
    priorities: [] as number[],
  },
  toggle: {
    isExpanded: true,
  }
};

const LessonsDetailPage: NextPage = () => {
  const router = useRouter();
  const { setError } = useError();
  const { state: { lessons }, getDataById } = useLessons();

  const { fillTargetRef} = useFillSpaceBelow<HTMLDivElement>();

  type Size = {
    width: number,
  }
  const [leftSize, setLeftSize] = useState<Size>({
    width: 150
  });

  const lessonId = useMemo(() => router.query.id ? Number(router.query.id) : undefined, [router.query.id]);
  const lesson = lessons[0];

  const { globalProgress, setGlobalProgress } = useGlobalProgress();
  const { state: { responses }, getDataByLessonId: getRespDataByLessonId, updateData, deleteData } = useResponses();
  const [orderedSentences, setOrderedSentences] = useState<OrderedSentences[]>([]);

  // クエスチョンデータを取得する
  const getQuestions = useCallback(async (id: number) => {
    type ResponseData = {
      rows: OrderedSentences[],
    }
    const { data } = await get<ResponseData>(`/lessons/${id}/ordered_sentences`);
    setOrderedSentences(data.rows);
    await getRespDataByLessonId(id);
  }, [setOrderedSentences, getRespDataByLessonId]);

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
            await getQuestions(lessonId);
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
  }, [setError, router, lessonId, getQuestions, setGlobalProgress, getDataById]);

  // ナビゲーションメニューの状態値
  const navData = useMemo(() => getNavData(orderedSentences), [orderedSentences]);

  // ユーティリティメニューの状態値
  const [utilsMeta, setUtilsMeta] = useState(INIT_UTILS_META);
  const handleOnClickToggle = () => {
    setUtilsMeta(prev => {
      return ({
        ...prev,
        toggle: {
          ...prev.toggle,
          isExpanded: !prev.toggle.isExpanded,
        }
      });
    });
  };
  const handleOnClickAnswer = () => {
    setUtilsMeta(prev => {
      return ({
        ...prev,
        answer: {
          ...prev.answer,
          active: !prev.answer.active,
        }
      });
    });
  };
  const handleOnClickPriority = (priority: number) => {
    setUtilsMeta(prev => {
      const idx = prev.phrase.priorities.indexOf(priority);
      let newState = null;
      if (idx !== -1) {
        newState = {
          ...prev,
          phrase: {
            ...prev.phrase,
            priorities: prev.phrase.priorities.filter(v => v !== priority)
          }
        };
      } else {
        newState = {
          ...prev,
          phrase: {
            ...prev.phrase,
            priorities: [...prev.phrase.priorities, priority]
          }
        };
      }
      return newState;
    });
  };
  const handleOnCheckAllPhr = () => {
    setUtilsMeta(prev => {
      return ({
        ...prev,
        phrase: {
          ...prev.phrase,
          priorities: JSON.parse(JSON.stringify(PRIORITIES)),
        }
      });
    });
  };
  const handleUnSetPhr = () => {
    setUtilsMeta(prev => {
      return ({
        ...prev,
        phrase: {
          ...prev.phrase,
          priorities: [],
        }
      });
    });
  };

  const questions: QsData = useMemo(
    () => createQsData(orderedSentences, responses, utilsMeta.phrase.priorities),
    [responses, orderedSentences, utilsMeta.phrase.priorities]
  );

  // レスポンス変更時の処理
  const handleOnUpdateResponse = async (params: OnUpdateRespParams) => {
    try {
      setGlobalProgress(true);
      await updateData(params);
      await getQuestions(lessonId as number);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (err.status === STATUS.UNAUTHORIZED) {
        router.push(URL.LOGIN);
      } else {
        setError(err);
      }
    } finally {
      setGlobalProgress(false);
    }
  };

  const confirmDeleteRespDlgState = useConfirmDeleteRespDlg();
  const handleOnClickDeleteResp = useCallback(() => {
    confirmDeleteRespDlgState.handleOnOpen();
  }, [confirmDeleteRespDlgState]);
  // レスポンス削除時の処理
  const handleOnClickDeleteRespRespDone = useCallback(async () => {
    try {
      setGlobalProgress(true);
      confirmDeleteRespDlgState.handleOnClose();
      await deleteData(lessonId as number);
      await getQuestions(lessonId as number);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (err.status === STATUS.UNAUTHORIZED) {
        router.push(URL.LOGIN);
      } else {
        setError(err);
      }
    } finally {
      setGlobalProgress(false);
    }
  }, [setError, getQuestions, router, lessonId, setGlobalProgress, deleteData, confirmDeleteRespDlgState]);

  return (
    <Layout
      pageType={PAGE_TYPES[IDX_FRONT_PAGE]}
    >
      <section id="page-wrapper" className='relative'>
        <Head>
          <title>{`${SITE_TITLE} | ${PAGE_TYPES_NM[IDX_DASH_PAGE]} - レッスン編集 - ${lessonId}`}</title>
        </Head>
        <NoInputNav
          className={styles['no-input-nav']}
          questions={questions}
        />
        <div className='relative'>
          <h1 className="page-title mb-[20px]">{lesson?.name}</h1>
          <div className={classNames(styles['utils'], 'flex')}>
            <Utils
              className='mr-[5px]'
              meta={utilsMeta}
              onClickToggle={handleOnClickToggle}
              onClickAnswer={handleOnClickAnswer}
              onClickPriority={handleOnClickPriority}
              onCheckAllPhr={handleOnCheckAllPhr}
              unSetPhr={handleUnSetPhr}
            />
            <Button
              variant='contained'
              onClick={handleOnClickDeleteResp}
            >
              全ての回答を削除
            </Button>
            <ConfirmDeleteRespDlg
              open={confirmDeleteRespDlgState.dlgOpen}
              onClose={confirmDeleteRespDlgState.handleOnClose}
              onSubmit={handleOnClickDeleteRespRespDone}
            />
          </div>
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
          {
            questions.length > 0 ? (
              <Questions
                className={styles['editable-content']}
                questions={questions}
                dispAns={utilsMeta.answer.active}
                onUpdateResponse={handleOnUpdateResponse}
                chapterTitleOpen={utilsMeta.toggle.isExpanded}
              />
            ) : null
          }
        </div>
      </section>
    </Layout>
  );
};
export default LessonsDetailPage;

function createQsData(
  orderedSentences: OrderedSentences[],
  responses: Response[],
  selectedPriorities: number[],
): QsData {
  return orderedSentences.map(orderedSentence => ({
    ...orderedSentence,
    sentences: orderedSentence.sentences.map(sent => ({
      ...sent,
      response: responses.find(res => res.sentence_id === sent.id)?.content
    })),
    phrases: orderedSentence.phrases.filter(phr => selectedPriorities.includes(phr.priority)),
    children: orderedSentence.children ? createQsData(orderedSentence.children, responses, selectedPriorities) : undefined,
  }));
}