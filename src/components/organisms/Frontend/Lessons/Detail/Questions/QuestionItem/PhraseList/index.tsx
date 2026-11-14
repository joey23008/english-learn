import { memo } from "react";
import ListItem from "@/components/molecules/List/Base/ListItem/Index";
import List from "@/components/molecules/List/Base/Index";
import PhraseItem from "../PhraseItem";
import { QsData } from "@/pages/frontend/lessons/[id]";
import styles from './styles.module.scss';

export type Props = {
  className?: string,
  listData: QsData[number]['phrases'],
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const PhraseList = memo((
  {
    className,
    listData,
    ...props
  }: Props
) => {
  return (
    <div className={className} {...props}>
      <List>
        {
          listData.map(data => (
            <ListItem key={data.id} style={{padding: 0}} className={styles['list-item']}>
              <PhraseItem
                data={data}
              />
            </ListItem>
          ))
        }
      </List>
    </div>
  );
});
PhraseList.displayName = 'PhraseList';
export default PhraseList;