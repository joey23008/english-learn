import { Sentence } from "ApiDataTypes";
import { memo, useCallback, useState } from "react";
import SentenceItem from './Item';
import AddIcon from '@mui/icons-material/Add';
import Txt from "@/components/atoms/Txt";
import Button from "@/components/atoms/Button";
import styles from './styles.module.scss';
import type { OnDeleteSentenceParams, OnUpdateSentenceParams } from "@/pages/dashboard/lessons/[id]";

type Props = {
  listData: Sentence[],
  onCreate: (params: { content: string, answer: string }) => Promise<number>,
  onUpdate: (params: OnUpdateSentenceParams) => Promise<void>,
  onDelete: (params: OnDeleteSentenceParams) => Promise<void>,
  loading: boolean,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const SentenceList = memo((
  {
    listData,
    onCreate,
    onUpdate,
    onDelete,
    loading,
    ...props
  }: Props
) => {

  const [newId, setNewId] = useState<number | null>(null); // フォーカス対象のID

  const handleOnCreate = useCallback(async () => {
    const insertedId = await onCreate({
      content: '',
      answer: '',
    });
    setNewId(insertedId);
  }, [onCreate, setNewId]);

  return (
    <div className="flex flex-col mt-[20px]" {...props}>
      <Txt>
        <Button
          variant="contained"
          className={styles['add-icon']}
          onClick={handleOnCreate}
          disabled={loading}
        >
          <AddIcon />
          クエスチョンを追加
        </Button>
      </Txt>
      {
        listData.map(sent => (
          <SentenceItem
            key={sent.id}
            className="mt-[15px]"
            data={sent}
            onUpdate={onUpdate}
            onDelete={() => onDelete({ id: sent.id })}
            focusOnMounted={sent.id === newId}
            loading={loading}
          />
        ))
      }
    </div>
  );
});
SentenceList.displayName = 'SentenceList';
export default SentenceList;