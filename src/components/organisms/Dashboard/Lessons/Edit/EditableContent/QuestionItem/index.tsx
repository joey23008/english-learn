import { OrderedSentences } from "ApiDataTypes";
import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import styles from './styles.module.scss';
import PhraseList from "./PhraseList";
import Insert, { useInsertIcon } from "../Insert";
import Utils, { useUtilIcon } from "../Utils";
import { EL_TYPE } from "../Insert/Menu";
import { CrItemParams, IDX_NEXT, INSRT_ACTS } from "@/pages/dashboard/lessons/[id]";
import type { OnDeleteQuestionParams, OnDeleteSentenceParams, OnUpdateQuestionParams, OnUpdateSentenceParams } from "@/pages/dashboard/lessons/[id]";
import classNames from "classnames";
import SubmitOnEnter from "@/components/atoms/TextField/SubmitOnEnter";
import { noCtrlChar } from "@/utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { ErrorTxt } from "@/components/atoms/Txt";
import CreatePhraseDlg, { useCreatePhraseDlg } from "./CreatePhraseDlg";
import UpdatePhraseDlg, { useUpdatePhraseDlg } from "./UpdatePhraseDlg";
import ConfirmDeletePhraseDlg, { useConfirmDeletePhraseDlg } from "./ConfirmDeletePhraseDlg";
import SentenceList from "./SentenceList";
import { useSetGlobalProgress } from "@/hooks/useGlobalProgress";
import { URL } from "@/consts";
import { useMouseHover } from "@/hooks/useMouseHover";
import ConfirmDeleteQsDlg, { useConfirmDeleteQsDlg } from "./ConfirmDeleteQsDlg";
import usePhrases from "@/hooks/usePhrases";
import useQuestionsPhrases from "@/hooks/useQuestionsPhrases";
import useSentences from "@/hooks/useSentences";
import { useError } from "@/hooks/useError";

type Question = {
  lesson_sentence_id: OrderedSentences['lesson_sentence_id'],
  user_number: OrderedSentences['user_number'],
  question_id: OrderedSentences['question_id'],
  phrases: OrderedSentences['phrases'],
  sentences: OrderedSentences['sentences'],
}

type Props = {
  className?: string,
  data: Question,
  onAddCrItem: (params: CrItemParams) => void,
  onUpdate: (params: OnUpdateQuestionParams) => Promise<void>,
  onDelete: (params: OnDeleteQuestionParams) => Promise<void>,
  lessonId: number | undefined,
  getOrderedSentences: (id: number) => Promise<OrderedSentences[]>,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

type FormValues = {
  name: string,
}

const QuestionItem = memo((
  {
    className,
    data,
    onAddCrItem,
    onUpdate,
    onDelete,
    lessonId,
    getOrderedSentences,
    ...props
  }: Props
) => {
  const { setGlobalProgress } = useSetGlobalProgress();
  const { setError } = useError();
  const [loading, setLoading] = useState(false);
  const triggerLoad = useCallback((value: boolean) => {
    setGlobalProgress(value);
    setLoading(value);
  }, [setGlobalProgress, setLoading]);

  // インサートメニューの状態値
  const { ref: hoverRef, isHover } = useMouseHover();
  const [dispInsertMenuIcon, setDispInsertMenuIcon] = useState(false);
  const { // インサートメニューの状態値
    insertIconEl,
    handleOpenInsertMenu,
    handleCloseInsertMenu,
  } = useInsertIcon();
  const { // ユーティリティメニューの状態値
    anchorElUser: utilIconEl,
    handleOnClickIcon: handleOpenUtilMenu,
    handleOnClose: handleCloseUtilMenu,
  } = useUtilIcon();
  // メニューアイコンの表示切替
  useEffect(() => {
    if (isHover) {
      setDispInsertMenuIcon(true);
    } else if (!insertIconEl && !utilIconEl) {
      setDispInsertMenuIcon(false);
    }
  }, [isHover, insertIconEl, utilIconEl, setDispInsertMenuIcon]);
  
  // 追加要素タイプ選択時の処理
  const handleOnAddNext = useCallback((type: (typeof EL_TYPE)[number]) => {
    onAddCrItem({
      type,
      lessonSentenceId: data.lesson_sentence_id,
      action: INSRT_ACTS[IDX_NEXT]
    });
  }, [onAddCrItem, data]);

  // チャプター名編集モードフラグ
  const [editable, setEditable] = useState(false);
  // ユーティリティメニューアイテム（編集）押下時の処理
  const handleOnClickEdit = useCallback(() => {
    setEditable(true);
  }, [setEditable]);
  // ユーティリティメニューアイテム（編集）クローズの処理
  const handleOnCloseEdit = useCallback(() => {
    setEditable(false);
  }, [setEditable]);
  const { handleSubmit, register, formState: { errors } } = useForm<FormValues>({
    shouldFocusError: false,
    defaultValues: {
      name: data.user_number as string,
    }
  });
  // 登録時の処理
  const handleOnSubmit: SubmitHandler<FormValues> = async ({ name }) => {
    if (name && data.user_number !== name) {
      await onUpdate({
        userNumber: name,
        questionId: data.question_id as number,
      });
      setEditable(false);
    } else {
      handleOnCloseEdit();
    }
  };

  // クエスチョン削除確認ダイアログの状態値
  const {
    handleOnClose: onClickDeleteDone,
    ...confirmDeleteQsDlgState
  } = useConfirmDeleteQsDlg();
  // ユーティリティメニューアイテム（削除）押下時の処理
  const handleOnClickDelete = useCallback(() => {
    confirmDeleteQsDlgState.handleOnOpen();
  }, [confirmDeleteQsDlgState]);
  // 削除確認ダイアログの削除ボタン押下時の処理
  const handleOnClickDeleteDone = useCallback(() => {
    onClickDeleteDone();
    onDelete({
      questionId: data.question_id as number,
    });
  }, [onDelete, data, onClickDeleteDone]);
  const confDelQsDlgData = useMemo(() => (
    {
      userNumber: data.user_number as string,
    }
  ), [data]);

  // フレーズ一覧テーブルの状態値
  const {
    handleOnEnChange: onEnChange,
    handleOnPhraseSubmit: onnPhraseSubmit,
    handleOnUpPhraseSubmit: onUpPhraseSubmit,
    ...phraseListState
  } = usePhraseList(data.phrases, lessonId, getOrderedSentences, data, setGlobalProgress);

  // 新規作成押下時の処理
  const handleOnPhraseSubmit = useCallback(async (params: OnPhraseSubmitParams) => {
    try {
      await onnPhraseSubmit(params);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(err);
    }
  }, [onnPhraseSubmit, setError]);

  // 新規作成押下時の処理
  const handleOnUpPhraseSubmit = useCallback(async (params: OnPhraseUpdateParams) => {
    try {
      await onUpPhraseSubmit(params);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(err);
    }
  }, [onUpPhraseSubmit, setError]);

  const handleOnEnChange = useCallback(async (en: string) => {
    await onEnChange(en);
  }, [onEnChange]);
  
  const sentenceListState = useSentenceList(lessonId, data.question_id as number, getOrderedSentences, triggerLoad);

  return (
    <>
      <div
        className={classNames(className, 'relative')}
        ref={hoverRef}
        {...props}
      >
        {
          editable ? (
            <div>
              <SubmitOnEnter
                {
                  ...register("name", {
                    maxLength: 255,
                    validate: {
                      noCtrlChar: v => noCtrlChar(v)
                    },
                  })
                }
                className='w-full'
                variant='outlined'
                error={Boolean(errors.name)}
                onBlur={handleSubmit(handleOnSubmit)}
                disabled={loading}
                onSubmit={handleSubmit(handleOnSubmit)}
                InputProps={{
                  sx: {
                    fontSize: '1.125rem',
                  }
                }}
              />
              {
                errors?.name?.type === 'maxLength' && <ErrorTxt className='mt-[5px]' size='s'>255文字以下で入力してください。</ErrorTxt>
              }
              {
                errors?.name?.type === 'noCtrlChar' && <ErrorTxt className='mt-[5px]' size='s'>非制御文字のみ入力して下さい。</ErrorTxt>
              }
            </div>
          ) : (
            <h2
              id={`${URL.PREF_HASH}-${String(data.lesson_sentence_id)}`}
              style={{
                padding: '8.5px 0',
                lineHeight: '1.4375em',
              }}
            >
              {data.user_number}
            </h2>
          )
        }
        <PhraseList
          listData={data.phrases}
          onClickCreate={phraseListState.handleOnDlgOpen}
          onClickUpdate={phraseListState.handleOnClickPhraseUpdate}
          onClickDelete={phraseListState.handleOnClickDelete}
          checkAll={phraseListState.checkAll}
          onCheckAll={phraseListState.handleCheckAll}
          checkedIds={phraseListState.checkedIds}
          onCheck={phraseListState.handleOnCheck}
        />
        <CreatePhraseDlg
          open={phraseListState.dlgOpen}
          onClickClose={phraseListState.handleOnDlgClose}
          onSubmit={handleOnPhraseSubmit}
          matches={phraseListState.matches}
          onEnChange={handleOnEnChange}
        />
        <UpdatePhraseDlg
          data={phraseListState.phraseUpData}
          open={phraseListState.upDlgOpen}
          onClickClose={phraseListState.handleOnUpDlgClose}
          onSubmit={handleOnUpPhraseSubmit}
        />
        <SentenceList
          listData={data.sentences}
          onCreate={sentenceListState.handleOnCreate}
          onUpdate={sentenceListState.handleOnUpdate}
          onDelete={sentenceListState.handleOnDelete}
          loading={loading}
        />
        {
          dispInsertMenuIcon && !editable ? (
            <>
              <Insert
                iconProps={{
                  className: styles['insert-ico'],
                }}
                isChapter={false}
                onAddNext={handleOnAddNext}
                insertIconEl={insertIconEl}
                handleOpenInsertMenu={handleOpenInsertMenu}
                handleCloseInsertMenu={handleCloseInsertMenu}
              />
              <Utils
                className={styles['utils-ico']}
                onClickEdit={handleOnClickEdit}
                onClickDelete={handleOnClickDelete}
                anchorElUser={utilIconEl}
                handleOnClickIcon={handleOpenUtilMenu}
                handleOnClose={handleCloseUtilMenu}
                style={{
                  position: 'absolute'
                }}
              />
            </>
          ) : null
        }
      </div>
      <ConfirmDeletePhraseDlg
        open={phraseListState.confDelPhrDlgOpen}
        onClose={phraseListState.handleOnConfDelPhrDlgClose}
        onDontDeleteTogether={phraseListState.handleOnDontDeleteTogether}
        onDeleteTogether={phraseListState.handleOnDeleteTogether}
      />
      <ConfirmDeleteQsDlg
        open={confirmDeleteQsDlgState.dlgOpen}
        data={confDelQsDlgData}
        onClose={onClickDeleteDone}
        onSubmit={handleOnClickDeleteDone}
      />
    </>
  );
}, arePropsEqual);
QuestionItem.displayName = 'QuestionItem';
export default QuestionItem;

function arePropsEqual(oldProps: Props, newProps: Props) {
  const tests = [
    oldProps.className === newProps.className,
    oldProps.onAddCrItem === newProps.onAddCrItem,
    oldProps.onUpdate === newProps.onUpdate,
    oldProps.onDelete === newProps.onDelete,
    oldProps.lessonId === newProps.lessonId,
    oldProps.getOrderedSentences === newProps.getOrderedSentences,
    (Object.keys(oldProps.data) as unknown as (keyof Question)[]).every(
      (key) => {
        if (key === 'phrases') {
          type PhrKeys = (keyof Question['phrases'][number])[]
          return oldProps.data[key].length === newProps.data[key].length && oldProps.data[key].every((oldPhr, idx) => {
            const newPhr = newProps.data[key][idx];
            return (Object.keys(oldPhr) as PhrKeys).every(phrKey => oldPhr[phrKey] === newPhr[phrKey]);
          });
        } else if (key === 'sentences') {
          type SentKeys = (keyof Question['sentences'][number])[]
          return oldProps.data[key].length === newProps.data[key].length && oldProps.data[key].every((oldSent, idx) => {
            const newSent = newProps.data[key][idx];
            return (Object.keys(oldSent) as SentKeys).every(sentKey => oldSent[sentKey] === newSent[sentKey]);
          });
        } else {
          return oldProps.data[key] === newProps.data[key];
        }
      }
    )
  ];
  return !tests.includes(false);
}

type OnPhraseSubmitParams = {
  en?: string,
  jp?: string,
  phraseId?: number,
  priority: number,
}

type OnPhraseUpdateParams = {
  id: number,
  phraseId: number,
  en: string,
  jp: string,
  priority: number,
}

function usePhraseList(
  phrases: Question['phrases'],
  lessonId: number | undefined,
  getOrderedSentences: (id: number) => Promise<OrderedSentences[]>,
  data: Question,
  setGlobalProgress: Dispatch<SetStateAction<boolean>>,
) {

  const { createData, deleteData: deletePhr, updateData } = useQuestionsPhrases();

  /** チェックボックス */
  const [checkAll, setCheckAll] = useState<boolean>(false); // 一括チェックフラグ
  const [checkedIds, setCheckedIds] = useState<number[]>([]); // 行チェックフラグ

  const handleCheckAll = useCallback(() => { // 一括チェック押下時の処理
    setCheckAll(prev => !prev);
  }, [setCheckAll]);

  useEffect(() => { // 一括チェック変更時の処理
    let newState: number[] = [];
    if (checkAll) {
      newState = phrases.map(v => v.qs_ph_id);
    }
    setCheckedIds(newState);
  }, [checkAll, setCheckedIds, phrases]);

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

  // フレーズマスタデータの状態値
  const { state: { phrases: tmpMatches }, getPartialMatch, reset: resetPhrData } = usePhrases();

  const matches = useMemo(() => { // 既に登録済みのフレーズは除外する
    return tmpMatches.filter(match => phrases.findIndex(phrase => phrase.id === match.id) === -1);
  }, [tmpMatches, phrases]);

  // フレーズ新規作成ダイアログの状態値
  const [
    dlgOpen,
    handleOnDlgOpen,
    handleOnDlgClose,
  ] = useCreatePhraseDlg();

  // 新規作成押下時の処理
  const handleOnPhraseSubmit = useCallback(async (params: OnPhraseSubmitParams) => {
    if (lessonId) {
      handleOnDlgClose();
      setGlobalProgress(true);
      await createData({
        phraseId: params.phraseId,
        en: params.phraseId ? undefined : params.en,
        jp: params.phraseId ? undefined : params.jp,
        lessonId,
        questionId: data.question_id as number,
        priority: params.priority,
      });
      await getOrderedSentences(lessonId);
      setGlobalProgress(false);
    }
  }, [handleOnDlgClose, getOrderedSentences, lessonId, data.question_id, setGlobalProgress, createData]);

  const handleOnEnChange = useCallback(async (en: string) => {
    if (en.length === 0) {
      resetPhrData();
    } else {
      setGlobalProgress(true);
      await getPartialMatch({
        keyword: en,
      });
      setGlobalProgress(false);
    }
  }, [resetPhrData, setGlobalProgress, getPartialMatch]);

  const {
    dlgOpen: confDelPhrDlgOpen,
    handleOnOpen: handleOnConfDelPhrDlgOpen,
    handleOnClose: handleOnConfDelPhrDlgClose,
  } = useConfirmDeletePhraseDlg();

  const handleOnClickDelete = useCallback(async () => { // 一括削除押下時の処理
    if (checkedIds.length > 0) {
      handleOnConfDelPhrDlgOpen();
    }
  }, [checkedIds, handleOnConfDelPhrDlgOpen]);

  const handleOnDontDeleteTogether = useCallback(async () => {
    if (lessonId) {
      handleOnConfDelPhrDlgClose();
      setGlobalProgress(true);
      await deletePhr({
        lessonId,
        questionId: data.question_id as number,
        qsPhrIds: checkedIds,
      });
      await getOrderedSentences(lessonId);
      setGlobalProgress(false);
    }
  }, [lessonId, data.question_id, checkedIds, getOrderedSentences, handleOnConfDelPhrDlgClose, setGlobalProgress, deletePhr]);

  const handleOnDeleteTogether = useCallback(async () => {
    if (lessonId) {
      handleOnConfDelPhrDlgClose();
      setGlobalProgress(true);
      await deletePhr({
        lessonId,
        questionId: data.question_id as number,
        qsPhrIds: checkedIds,
        deleteMasterData: true,
      });
      await getOrderedSentences(lessonId);
      setGlobalProgress(true);
    }
  }, [lessonId, data.question_id, checkedIds, getOrderedSentences, handleOnConfDelPhrDlgClose, setGlobalProgress, deletePhr]);

  // クエスチョンデータ更新時にチェック解除する
  useEffect(() => {
    setCheckAll(false);
  }, [data, setCheckAll]);

  // フレーズ更新ダイアログの状態値
  const [
    upDlgOpen,
    handleOnUpDlgOpen,
    handleOnUpDlgClose,
  ] = useUpdatePhraseDlg();
  const [phraseUpData, setPhraseUpData] = useState<Question['phrases'][number]>(); // 更新対象フレーズデータ

  // 更新メニュー押下時の処理
  const handleOnClickPhraseUpdate = useCallback(() => {
    const qsPhrId = checkedIds[0];
    const phrase = phrases.find(v => v.qs_ph_id === qsPhrId);
    if (phrase) {
      setPhraseUpData(phrase);
      handleOnUpDlgOpen();
    }
  }, [checkedIds, phrases, setPhraseUpData, handleOnUpDlgOpen]);

  // 更新ダイアログ登録の処理
  const handleOnUpPhraseSubmit = useCallback(async (params: OnPhraseUpdateParams) => {
    if (lessonId) {
      handleOnUpDlgClose();
      setGlobalProgress(true);
      await updateData(params);
      await getOrderedSentences(lessonId);
      setGlobalProgress(false);
    }
  }, [handleOnUpDlgClose, getOrderedSentences, lessonId, setGlobalProgress, updateData]);

  return {
    checkAll,
    setCheckAll,
    checkedIds,
    handleCheckAll,
    handleOnCheck,
    handleOnPhraseSubmit,
    handleOnEnChange,
    handleOnDlgOpen,
    handleOnClickDelete,
    dlgOpen,
    handleOnDlgClose,
    matches,
    confDelPhrDlgOpen,
    handleOnConfDelPhrDlgClose,
    handleOnDontDeleteTogether,
    handleOnDeleteTogether,
    phraseUpData,
    handleOnClickPhraseUpdate,
    upDlgOpen,
    handleOnUpDlgOpen,
    handleOnUpDlgClose,
    handleOnUpPhraseSubmit,
  };
};

function useSentenceList(
  lessonId: number | undefined,
  questionId: number,
  getOrderedSentences: (id: number) => Promise<OrderedSentences[]>,
  triggerLoad: (value: boolean) => void,
) {
  const { createData: createSentence, updateData: updateSentence, deleteData: deleteSentence } = useSentences();
  const handleOnCreate = useCallback(async (params: { content: string, answer: string }) => {
    triggerLoad(true);
    const inserted = await createSentence({
      ...params,
      lessonId: lessonId as number,
      questionId,
    });
    
    await getOrderedSentences(lessonId as number);
    triggerLoad(false);
    return inserted[0].id;
  }, [getOrderedSentences, lessonId, questionId, triggerLoad, createSentence]);

  const handleOnUpdate = useCallback(async (params: OnUpdateSentenceParams) => {
    triggerLoad(true);
    await updateSentence(params);
    await getOrderedSentences(lessonId as number);
    triggerLoad(false);
  }, [getOrderedSentences, lessonId, triggerLoad, updateSentence]);

  const handleOnDelete = useCallback(async (params: OnDeleteSentenceParams) => {
    triggerLoad(true);
    await deleteSentence(params);
    await getOrderedSentences(lessonId as number);
    triggerLoad(false);
  }, [getOrderedSentences, lessonId, triggerLoad, deleteSentence]);

  return {
    handleOnCreate,
    handleOnUpdate,
    handleOnDelete,
  };
}