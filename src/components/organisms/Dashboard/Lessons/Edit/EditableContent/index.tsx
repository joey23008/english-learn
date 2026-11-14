import { memo, useCallback, useState } from "react";
import { OrderedSentences } from "ApiDataTypes";
import classNames from "classnames";
import ChapterItem from "./ChapterItem";
import type { OnDeleteChapterParams, OnDeleteQuestionParams, OnUpdateChapterParams, OnUpdateQuestionParams } from "@/pages/dashboard/lessons/[id]";
import QuestionItem from "./QuestionItem";
import { EL_TYPE } from "./Insert/Menu";
import { OrderedSentencesOrDammy, DAMMY_CR_ID } from "@/pages/dashboard/lessons/[id]";
import DammyCrItem from "./DammyCrItem/Index";
import type { OnSubmitParams } from "./DammyCrItem/Index";
import { CrItemParams } from "@/pages/dashboard/lessons/[id]";
import InsertIcon from "./Insert/Icon";
import TypeSelect from "./Insert/Menu/TypeSelect";
import styles from './styles.module.scss';
import Txt from "@/components/atoms/Txt";

export type Props = {
  nested?: boolean,
  className?: string,
  orderedSentences: OrderedSentencesOrDammy[],
  // parentIdxs: number[],
  onAddCrItem: (params: CrItemParams) => void,
  onDammyCrSubmit: (params: OnSubmitParams) => void,
  // loading: boolean,
  onUpdateChapter: (params: OnUpdateChapterParams) => Promise<void>,
  onDeleteChapter: (params: OnDeleteChapterParams) => Promise<void>,
  onUpdateQuestion: (params: OnUpdateQuestionParams) => Promise<void>,
  onDeleteQuestion: (params: OnDeleteQuestionParams) => Promise<void>,
  lessonId: number | undefined,
  getOrderedSentences: (id: number) => Promise<OrderedSentences[]>,
  chapterTitleOpen: boolean,
  [kay: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const EditableContent = memo(({
  nested=false,
  className,
  orderedSentences,
  onAddCrItem,
  onDammyCrSubmit,
  onUpdateChapter,
  onDeleteChapter,
  onUpdateQuestion,
  onDeleteQuestion,
  lessonId,
  getOrderedSentences,
  chapterTitleOpen,
  ...props
}: Props) => {
  // インサートメニュの状態値
  const [insrtIconEl, setInsrtIconEl] = useState<HTMLElement | null>(null);
  const handleOpenInsrtMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setInsrtIconEl(insrtIconEl ? null : event.currentTarget);
  }, [setInsrtIconEl, insrtIconEl]);
  const handleCloseInsrtMenu = useCallback(() => {
    setInsrtIconEl(null);
  }, [setInsrtIconEl]);
  // 追加要素タイプ選択時の処理
  const handleOnClickType = useCallback((type: (typeof EL_TYPE)[number]) => {
    onAddCrItem({
      type,
    });
    handleCloseInsrtMenu();
  }, [onAddCrItem, handleCloseInsrtMenu]);

  return (
    <div className={classNames('flex', 'flex-col', className)} {...props}>
    {
      orderedSentences.length > 0 || nested ? (
        orderedSentences.map((data) => {
          return (
            data.lesson_sentence_id === DAMMY_CR_ID ? (
              <DammyCrItem
                className={styles['list-item']}
                key={data.lesson_sentence_id}
                data={{
                  type: data.type,
                  number: data.number,
                  parent: data.parent,
                }}
                onSubmit={onDammyCrSubmit}
                // loading={loading}
              />
            ) : (
              data.chapter_id ? (
                <ChapterItem
                  key={data.lesson_sentence_id}
                  className={styles['list-item']}
                  data={data}
                  onAddCrItem={onAddCrItem}
                  titleOpen={chapterTitleOpen}
                  editableContentProps={{
                    onDammyCrSubmit,
                    onUpdateQuestion,
                    onDeleteQuestion,
                    getOrderedSentences,
                    lessonId,
                  }}
                  onUpdate={onUpdateChapter}
                  onDelete={onDeleteChapter}
                />
              ) : (
                <QuestionItem
                  key={data.lesson_sentence_id}
                  className={styles['list-item']}
                  data={{
                    lesson_sentence_id: data.lesson_sentence_id,
                    user_number: data.user_number,
                    question_id: data.question_id,
                    phrases: data.phrases,
                    sentences: data.sentences,
                  }}
                  // idxs={[...parentIdxs, idx]}
                  // currentIdx={idx}
                  // parentIdxs={parentIdxs}
                  onAddCrItem={onAddCrItem}
                  onUpdate={onUpdateQuestion}
                  onDelete={onDeleteQuestion}
                  // loading={loading}
                  lessonId={lessonId}
                  getOrderedSentences={getOrderedSentences}
                />
              )
            )
          );
        })
      ) : (
        <div
          className={styles['info-item']}
          onClick={handleOpenInsrtMenu}
          tabIndex={0}
        >
          <InsertIcon
            className={styles['insert-ico']}
          />
          <Txt>要素を選択して新規追加する。</Txt>
          <TypeSelect
            anchorEl={insrtIconEl}
            onClose={handleCloseInsrtMenu}
            onClickType={handleOnClickType}
            placement='bottom-start'
          />
        </div>
      )
    }
    </div>
  );
});
EditableContent.displayName = 'EditableContent';
export default EditableContent;