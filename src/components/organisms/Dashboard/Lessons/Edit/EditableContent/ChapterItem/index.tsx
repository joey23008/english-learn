import { memo, useCallback, useEffect, useState } from "react";
import styles from './styles.module.scss';
import EditableContent from "..";
import { OrderedSentences } from "ApiDataTypes";
import classNames from "classnames";
import Accordion from "@/components/molecules/Accordion/IconRotate/Index";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Utils, { useUtilIcon } from "../Utils";
import Insert, { useInsertIcon } from "../Insert";
import { EL_TYPE } from "../Insert/Menu";
import type { Props as EditableContentProps } from '../index';
import { SubmitHandler, useForm } from "react-hook-form";
import SubmitOnEnter from "@/components/atoms/TextField/SubmitOnEnter";
import { noCtrlChar } from "@/utils";
import { URL } from "@/consts";
import { ErrorTxt } from "@/components/atoms/Txt";
import { IDX_FIRST, IDX_NEXT, INSRT_ACTS, type CrItemParams, type OnDeleteChapterParams, type OnDeleteQuestionParams, type OnUpdateChapterParams, type OnUpdateQuestionParams } from "@/pages/dashboard/lessons/[id]";
import { useMouseHover } from "@/hooks/useMouseHover";
import ConfirmDeleteChapDlg, { useConfirmDeleteChapDlg } from "./ConfirmDeleteChapDlg";

type Props = {
  className?: string,
  data: OrderedSentences,
  onAddCrItem: (params: CrItemParams) => void,
  titleOpen: boolean,
  editableContentProps: {
    onDammyCrSubmit: EditableContentProps['onDammyCrSubmit'],
    onUpdateQuestion: (params: OnUpdateQuestionParams) => Promise<void>,
    onDeleteQuestion: (params: OnDeleteQuestionParams) => Promise<void>,
    lessonId: number | undefined,
    getOrderedSentences: (id: number) => Promise<OrderedSentences[]>,
  }
  onUpdate: (params: OnUpdateChapterParams) => Promise<void>,
  onDelete: (params: OnDeleteChapterParams) => Promise<void>,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

type FormValues = {
  name: string,
}

const ChapterItem = memo(({
  className, data, onAddCrItem, titleOpen, editableContentProps, onUpdate, onDelete, ...props
}: Props) => {
  // アコーディオンの状態値
  const [open, setOpen] = useState(titleOpen);
  const onToggle = useCallback((next: boolean) => {
    setOpen(next);
  }, [setOpen]);
  useEffect(() => {
    setOpen(titleOpen);
  }, [titleOpen]);
  
  // メニュー関連の状態値
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
  const handleOnAddFirst = useCallback((type: (typeof EL_TYPE)[number]) => {
    setOpen(true);
    onAddCrItem({
      type,
      lessonSentenceId: data.lesson_sentence_id,
      action: INSRT_ACTS[IDX_FIRST],
    });
  }, [onAddCrItem, data, setOpen]);

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
      name: data.chapter_name as string,
    }
  });

  // クエスチョン削除確認ダイアログの状態値
  const confirmDeleteChapDlgState = useConfirmDeleteChapDlg();
  // ユーティリティメニューアイテム（削除）押下時の処理
  const handleOnClickDelete = useCallback(() => {
    confirmDeleteChapDlgState.handleOnOpen();
  }, [confirmDeleteChapDlgState]);
  // 削除確認ダイアログの削除ボタン押下時の処理
  const handleOnClickDeleteDone = useCallback(() => {
    confirmDeleteChapDlgState.handleOnClose();
    onDelete({
      chapterId: data.chapter_id as number,
    });
  }, [onDelete, data, confirmDeleteChapDlgState]);

  // 登録時の処理
  const handleOnSubmit: SubmitHandler<FormValues> = async ({ name }) => {
    if (name && data.chapter_name !== name) {
      await onUpdate({
        name: name,
        chapterId: data.chapter_id as number,
      });
      setEditable(false);
    } else {
      handleOnCloseEdit();
    }
  };

  return (
    <div
      className={classNames(styles['chapter-item'], className)}
      {...props}
    >
      <Accordion
        open={open}
        onToggle={onToggle}
        renderIcon={<ArrowDropDownIcon />}
        togglerIcoEnable={!editable}
        toggler={
          ({ onClick }) => (
            <div
              className="relative"
              ref={hoverRef}
            >
              {
                editable ? (
                  <div className={styles['title']}>
                    <SubmitOnEnter
                      {
                        ...register("name", {
                          maxLength: 255,
                          validate: {
                            noCtrlChar: v => noCtrlChar(v)
                          },
                        })
                      }
                      id='name'
                      className='w-full'
                      variant='outlined'
                      error={Boolean(errors.name)}
                      onBlur={handleSubmit(handleOnSubmit)}
                      // disabled={loading}
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
                    className={classNames(styles['title'])}
                    onClick={onClick}
                    style={{
                      padding: '8.5px 0',
                      lineHeight: '1.4375em',
                    }}
                  >
                    {data.chapter_name}
                  </h2>
                )
              }
              {
                dispInsertMenuIcon && !editable ? (
                  <>
                    <Insert
                      iconProps={{
                        className: styles['insert-ico'],
                      }}
                      isChapter={true}
                      onAddNext={handleOnAddNext}
                      onAddFirst={handleOnAddFirst}
                      insertIconEl={insertIconEl}
                      handleOpenInsertMenu={handleOpenInsertMenu}
                      handleCloseInsertMenu={handleCloseInsertMenu}
                    />
                    <Utils
                      className={styles['utils-ico']}
                      onClickEdit={handleOnClickEdit}
                      anchorElUser={utilIconEl}
                      handleOnClickIcon={handleOpenUtilMenu}
                      handleOnClose={handleCloseUtilMenu}
                      onClickDelete={handleOnClickDelete}
                    />
                  </>
                ) : null
              }
              <ConfirmDeleteChapDlg
                open={confirmDeleteChapDlgState.dlgOpen}
                data={{
                  name: data.chapter_name as string,
                }}
                onClose={confirmDeleteChapDlgState.handleOnClose}
                onSubmit={handleOnClickDeleteDone}
              />
            </div>
          )
        }
        content={
          <EditableContent
            nested={true}
            orderedSentences={data.children as OrderedSentences[]}
            className="pl-[1.5rem]"
            onAddCrItem={onAddCrItem}
            {...editableContentProps}
            onUpdateChapter={onUpdate}
            onDeleteChapter={onDelete}
            chapterTitleOpen={titleOpen}
          />
        }
      >
      </Accordion>
    </div>
  );
});
ChapterItem.displayName = 'ChapterItem';
export default ChapterItem;