import { memo } from "react";
import styles from './styles.module.scss';
import classNames from "classnames";
import Accordion from "@/components/molecules/Accordion/IconRotate/Index";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { URL } from "@/consts";
import Questions from "..";
import { QsData } from "@/pages/frontend/lessons/[id]";
import { OnUpdateParams } from "../QuestionItem/SentenceItem";

type Props = {
  className?: string,
  data: QsData[number],
  titleOpen: boolean,
  questionsProps: {
    dispAns: boolean,
    onUpdateResponse: (params: OnUpdateParams) => void,
  }
}

const ChapterItem = memo(({
  className, data, questionsProps, titleOpen
}: Props) => {
  return (
    <div
      className={classNames(styles['chapter-item'], className)}
    >
      <Accordion
        open={titleOpen}
        renderIcon={<ArrowDropDownIcon />}
        toggler={
          ({onClick}) => (
            <div
              className="relative"
            >
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
            </div>
          )
        }
        content={
          <Questions
            questions={data.children as QsData}
            className="pl-[1.5rem]"
            chapterTitleOpen={titleOpen}
            {...questionsProps}
          />
        }
      />
    </div>
  );
});
ChapterItem.displayName = 'ChapterItem';
export default ChapterItem;