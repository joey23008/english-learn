import { QsData } from "@/pages/frontend/lessons/[id]";
import classNames from "classnames";
import { memo } from "react";
import { URL } from "@/consts";
import PhraseList from "./PhraseList";
import SentenceList from "./SentenceList";
import { OnUpdateParams } from "./SentenceItem";

type Question = {
  lesson_sentence_id: QsData[number]['lesson_sentence_id'],
  user_number: QsData[number]['user_number'],
  question_id: QsData[number]['question_id'],
  phrases: QsData[number]['phrases'],
  sentences: QsData[number]['sentences'],
}

type Props = {
  className?: string,
  data: Question,
  dispAns: boolean,
  onUpdateResponse: (params: OnUpdateParams) => void,
}

const QuestionItem = memo((
  {
    className,
    data,
    dispAns,
    onUpdateResponse,
  }: Props
) => {
  return (
    <div className={classNames(className, 'relative')}>
      <h2
        id={`${URL.PREF_HASH}-${String(data.lesson_sentence_id)}`}
        style={{
          paddingTop: '8.5px',
          lineHeight: '1.4375em',
        }}
      >
        {data.user_number}
      </h2>
      {
        data.phrases.length > 0 ? (
          <PhraseList
            className="mt-[15px]"
            listData={data.phrases}
          />
        ) : null
      }
      <SentenceList
        className="mt-[15px]"
        listData={data.sentences}
        onUpdate={onUpdateResponse}
        openAns={dispAns}
      />
    </div>
  );
}, arePropsEqual);
QuestionItem.displayName = 'QuestionItem';
export default QuestionItem;

function arePropsEqual(oldProps: Props, newProps: Props) {
  const tests = [
    oldProps.className === newProps.className,
    String(oldProps.onUpdateResponse) === String(newProps.onUpdateResponse),
    oldProps.dispAns === newProps.dispAns,
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
            return (Object.keys(oldSent) as SentKeys).every(sentKey => (oldSent as Question['sentences'][number])[sentKey] === newSent[sentKey]);
          });
        } else {
          return oldProps.data[key] === newProps.data[key];
        }
      }
    )
  ];
  return !tests.includes(false);
}