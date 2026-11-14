import { memo } from "react";
import { QsData } from "@/pages/frontend/lessons/[id]";
import SentenceItem from "../SentenceItem";
import type { OnUpdateParams } from "../SentenceItem";
import styles from './styles.module.scss';

export type Props = {
  className?: string,
  listData: QsData[number]['sentences'],
  onUpdate: (params: OnUpdateParams) => void,
  openAns: boolean,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const SentenceList = memo((
  {
    className,
    listData,
    onUpdate,
    openAns,
    ...props
  }: Props
) => {
  return (
    <div className={className} {...props}>
      {
        listData.map(data => (
          <SentenceItem
            key={data.id}
            className={styles['list-item']}
            data={data}
            onUpdate={onUpdate}
            openAns={openAns}
          />
        ))
      }
    </div>
  );
});
SentenceList.displayName = 'SentenceList';
export default SentenceList;