import { useMemo, useState } from "react";
import classNames from "classnames";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { QsData } from "@/pages/frontend/lessons/[id]";
import styles from './styles.module.scss';
import { URL } from "@/consts";

export type Props = {
  className?: string,
  questions: QsData,
}

const NoInputNav = ({
  className,
  questions,
}: Props) => {
  const noInputDataIds = useMemo(() => findNoInputDataIds(questions), [questions]); // 回答未入力データの存在する問題のlesson_sentence_idのリスト
  const [currentIdx, setCurrentIdx] = useState(-1);
  const disabled = noInputDataIds.length === 0;

  // アイコン押下時の処理
  const handleOnClick = (action: 'prev' | 'next') => {
    let nextId = null;
    let nextIdx = null;
    if (action === 'prev') {
      for (let i = currentIdx - 1; i >= 0; i--) {
        if (Boolean(noInputDataIds[i])) {
          nextId = noInputDataIds[i];
          nextIdx = i;
          break;
        }
      }
      if (!nextId) {
        for (let i = noInputDataIds.length - 1; i >= 0; i--) {
          if (Boolean(noInputDataIds[i])) {
            nextId = noInputDataIds[i];
            nextIdx = i;
            break;
          }
        }
      }
    } else {
      for (let i = currentIdx + 1; i < noInputDataIds.length; i++) {
        if (Boolean(noInputDataIds[i])) {
          nextId = noInputDataIds[i];
          nextIdx = i;
          break;
        }
      }
      if (!nextId) {
        for (let i = 0; i < noInputDataIds.length; i++) {
          if (Boolean(noInputDataIds[i])) {
            nextId = noInputDataIds[i];
            nextIdx = i;
            break;
          }
        }
      }
    }
    if (nextId && typeof nextIdx === 'number') {
      const target = document.getElementById(`${URL.PREF_HASH}-${nextId}`);
      if (target) {
        target.scrollIntoView();
      }
      setCurrentIdx(nextIdx);
    }
  };

  return (
    <div className={classNames(className)}>
      <div className={styles['nav-item']}>
        <KeyboardArrowUpIcon
          className={classNames({
            [styles.icon]: true,
            'disabled': disabled,
          })}
          onClick={() => !disabled ? handleOnClick('prev') : null}
        />
      </div>
      <div className={styles['nav-item']}>
        <KeyboardArrowDownIcon
          className={classNames({
            [styles.icon]: true,
            'disabled': disabled,
          })}
          onClick={() => !disabled ? handleOnClick('next') : null}
        />
      </div>
    </div>
  );
};
NoInputNav.displayName = 'NoInputNav';
export default NoInputNav;

function findNoInputDataIds(
  quetions: QsData
): (number | null)[] {
  const result: (number | null)[] = [];

  const traverse = (items: QsData) => {
    for (const item of items) {
      if (item.question_id) {
        const match = item.sentences.some(sent => !Boolean((sent as QsData[number]['sentences'][number]).response));
        result.push(match ? item.lesson_sentence_id : null);
      }
      if (item.children) {
        traverse(item.children);
      }
    }
  };

  traverse(quetions);
  return result;
}