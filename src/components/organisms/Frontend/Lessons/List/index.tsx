import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { SortDirectionsValue } from 'ConstTypes';
import { dateFormat } from '@/utils';
import styles from './styles.module.scss';
import { SORT_FIELDS } from '@/pages/frontend/lessons';
import Pagination from '@/components/molecules/Pagination';
import { Lesson } from 'ApiDataTypes';
import DTh, { BasicDThProps } from '@/components/molecules/Table/DataTable/Basic/DTh';
import DT from '@/components/molecules/Table/DataTable/Basic/DT';
import DThead from '@/components/molecules/Table/DataTable/Basic/DThead';
import DTr from '@/components/molecules/Table/DataTable/Basic/DTr';
import DTbody from '@/components/molecules/Table/DataTable/Basic/DTbody';
import DTd from '@/components/molecules/Table/DataTable/Basic/DTd';
import CircularProgress from '@/components/molecules/Progress/Circular';
import Link from 'next/link';

export type Condition = {
  page: number,
  sortField: typeof SORT_FIELDS[number],
  sortDirection: SortDirectionsValue,
}

type Props = {
  className?: string,
  lessonsData: {
    lessons: Lesson[],
    total: number,
    loading: boolean,
  },
  condition: Condition,
  onClickSortIcon: Required<BasicDThProps>['onClick'],
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void,
}


type TblHeaders = {
  sort: {
    order: SortDirectionsValue | null,
    id: string,
  },
  label: string,
}[]
const INIT_TBL_HEADERS: TblHeaders = [
  {
    sort: {
      order: null,
      id: 'name',
    },
    label: '名前',
  },
  {
    sort: {
      order: null,
      id: 'created_at',
    },
    label: '作成日',
  },
];
const LIMIT = 10;

const LessonList = memo(
  (
    {
      className,
      lessonsData: { lessons, total, loading },
      condition,
      onClickSortIcon,
      onPageChange,
    }: Props
  ) => {

  const [headers, setHeaders] = useState<TblHeaders>(INIT_TBL_HEADERS); // テーブルヘッダーメタ情報

  // テーブルヘッダーのソート情報を更新する
  useEffect(() => {
    setHeaders((prev: TblHeaders) => {
      const cpHeaders: TblHeaders = JSON.parse(JSON.stringify(prev));
      const idx = cpHeaders.findIndex(h => h.sort.id === condition.sortField);
      if (idx !== -1) {
        const nxtEnabled = cpHeaders[idx];
        nxtEnabled.sort.order = condition.sortDirection;
        cpHeaders.forEach((h, i) => {
          if (i !== idx) h.sort.order = null;
        });
      }
      return cpHeaders;
    });
    
  }, [condition.sortField, condition.sortDirection, setHeaders]);

  // テーブルボディデータの作成
  const rows = useMemo(() => (
    lessons.map(lesson => (
      {
        id: lesson.id,
        fields: [
          {
            value: lesson.name,
            link: `/frontend/lessons/${lesson.id}`,
          },
          {
            value: dateFormat(lesson.created_at),
          },
        ]
      }
    ))
  ), [lessons]);
  
  // ページネーションリンク押下時の処理
  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(event, value);
  }, [onPageChange]);

  return (
    <section className={className}>
      <DT
        className={styles['table-area']}
      >
        <DThead>
          <DTr>
            {
              headers.map(h => (
                <DTh
                  key={h.label}
                  sort={h.sort}
                  onClick={onClickSortIcon}
                >{h.label}</DTh>
              ))
            }
          </DTr>
        </DThead>
        <DTbody>
          {
            !loading ? (
              rows.length > 0 ? rows.map((row) => (
                <DTr key={row.id}>
                  {
                    row.fields.map((v, idx) => (
                      <DTd key={`${row.id}-${idx}`}>
                        {
                          v.link ? (
                            <Link href={v.link}>{v.value}</Link>
                          ) : v.value
                        }
                      </DTd>
                    ))
                  }
                </DTr>
              )) :
              <DTr>
                <DTd
                  className='text-center'
                  colSpan={headers.length + 1}
                >
                  表示するデータがありません。
                </DTd>
              </DTr>
            ) :
            (
              <DTr>
                <DTd
                  className='text-center'
                  colSpan={headers.length + 1}
                >
                  <CircularProgress size="1.125rem" />
                </DTd>
              </DTr>
            )
          }
        </DTbody>
      </DT>
      <Pagination
        className="mt-[10px]"
        count={Math.ceil(total / LIMIT)}
        page={condition.page}
        onChange={handlePageChange}
      />
    </section>
  );
});

LessonList.displayName = 'LessonList';
export default LessonList;