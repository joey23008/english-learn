import classNames from 'classnames';
import styles from './styles.module.scss';
import { CSSProperties, useCallback } from 'react';
import { URL } from '@/consts';
import { OrderedSentences } from 'ApiDataTypes';

type Data = {
  id: number,
  label: string,
  children?: Data[],
}

export type Props = {
  className?: string,
  listData:Data[],
  loading: boolean,
}

const OrderedSentencesNav = ({ className, listData, loading }: Props) => {
  const handleOnClickLabel = useCallback((id: number) => {
    const target = document.getElementById(`${URL.PREF_HASH}-${id}`);
    if (target) {
      target.scrollIntoView();
    }
  }, []);
  return (
    <div className={classNames(className, styles['navigation-list'])}>
      <RecursiveList listData={listData} onClickLabel={handleOnClickLabel} loading={loading} />
    </div>
  );
};
OrderedSentencesNav.displayName = 'OrderedSentencesNav';

export default OrderedSentencesNav;

type RecursiveListProps = {
  listData: Data[],
  style?: CSSProperties,
  onClickLabel: (number: number) => void,
  loading: boolean,
}
const RecursiveList = ({ listData, style, onClickLabel, loading }: RecursiveListProps) => (
  <div className='flex flex-col' style={style}>
    {
      listData.length > 0 ? (
        listData.map(data => (
          <div key={data.id}>
            <div
              className={classNames(
                {
                  [styles.label]: true,
                  [styles.disabled]: loading,
                }
              )}
              tabIndex={loading ? -1 : 0}
              onClick={() => !loading && onClickLabel(data.id)}
            >
              {data.label}
            </div>
            {
              data.children ? (
                <RecursiveList
                  listData={data.children}
                  style={{paddingLeft: '15px'}}
                  onClickLabel={onClickLabel}
                  loading={loading}
                />
              ) : null
            }
          </div>
        ))
      ) : (
        <div>
          <div className={styles.label}>表示するデータがありません。</div>
        </div>
      )
    }
  </div>
);

export function getNavData(orderedSentences: OrderedSentences[]) {
  return orderedSentences.map(sent => {
    const data: Props['listData'][number] = {
      id: sent.lesson_sentence_id,
      label: sent.chapter_name ? sent.chapter_name as string : sent.user_number as string,
    };
    if (sent.children && sent.children.length > 0) {
      data.children = getNavData(sent.children);
    }
    return data;
  });
}