import { memo } from "react";
import classNames from "classnames";
import ChapterItem from "./ChapterItem";
import styles from './styles.module.scss';
import { QsData } from "@/pages/frontend/lessons/[id]";
import QuestionItem from "./QuestionItem";
import { OnUpdateParams } from "./QuestionItem/SentenceItem";

export type Props = {
  className?: string,
  questions: QsData,
  dispAns: boolean,
  onUpdateResponse: (params: OnUpdateParams) => void,
  chapterTitleOpen: boolean,
  [kay: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Questions = memo(({
  className,
  questions,
  dispAns,
  onUpdateResponse,
  chapterTitleOpen,
  ...props
}: Props) => {
  return (
    <div className={classNames('flex', 'flex-col', className)} {...props}>
    {
      questions.map((data) => {
        return (
          data.chapter_id ? (
            <ChapterItem
              key={data.lesson_sentence_id}
              className={styles['list-item']}
              data={data}
              titleOpen={chapterTitleOpen}
              questionsProps={{
                dispAns,
                onUpdateResponse,
              }}
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
              dispAns={dispAns}
              onUpdateResponse={onUpdateResponse}
            />
          )
        );
      })
    }
    </div>
  );
});
Questions.displayName = 'Questions';
export default Questions;