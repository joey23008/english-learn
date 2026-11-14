import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { SortDirectionsValue } from 'ConstTypes';
import { dateFormat } from '@/utils';
import styles from './styles.module.scss';
import { SORT_FIELDS } from "@/pages/api/lessons";
import TableCheckBox from '@/components/molecules/Table/DataTable/CheckBox';
import Pagination from '@/components/molecules/Pagination';
import Menu from "@/components/molecules/Menu";
import MenuItem from "@/components/molecules/Menu/Item";
import { Lesson } from 'ApiDataTypes';
import { BasicDThProps } from '@/components/molecules/Table/DataTable/Basic/DTh';

export type Condition = {
  page: number,
  sortField: typeof SORT_FIELDS[number],
  sortDirection: SortDirectionsValue,
}

type CheckId = (number | string)

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
  onClickCreate: () => void,
  onClickDelete: () => void,
  checkAll: boolean,
  onCheckAll: () => void,
  checkedIds: CheckId[],
  onCheck: (id: CheckId) => void,
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
      id: 'id',
    },
    label: 'ID',
  },
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
  {
    sort: {
      order: null,
      id: 'updated_at',
    },
    label: '更新日',
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
      onClickCreate,
      onClickDelete,
      checkAll,
      onCheckAll,
      checkedIds,
      onCheck,
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

  // ソートアイコンクリック時の処理
  const handleOnClickSortIcon = useCallback((id: string | null, nextOrder: SortDirectionsValue | null) => {
    onClickSortIcon(id, nextOrder);
  }, [onClickSortIcon]);

  // テーブルボディデータの作成
  const rows = useMemo(() => (
    lessons.map(lesson => (
      {
        checkId: lesson.id,
        fields: [
          {
            value: lesson.id,
          },
          {
            value: lesson.name,
            link: `/dashboard/lessons/${lesson.id}`,
          },
          {
            value: dateFormat(lesson.created_at),
          },
          {
            value: dateFormat(lesson.updated_at),
          },
        ]
      }
    ))
  ), [lessons]);
  
  // ページネーションリンク押下時の処理
  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(event, value);
  }, [onPageChange]);

  const [open, setOpen] = useState<boolean>(false); // DTMenuのオープンフラグ
  const handleClose = useCallback(() => { // DTMenuを閉じる処理
    setOpen(false);
  }, [setOpen]);
  const handleMenuIconClick = useCallback(() => { // DTMenuオープンアイコン押下時の処理
    setOpen(prev => !prev);
  }, [setOpen]);
  const handleOnClickCreate = useCallback(() => {
    handleClose();
    onClickCreate();
  }, [handleClose, onClickCreate]);

  const [bulkOpsEl, setBulkOpsEl] = useState<null | HTMLElement>(null); // 一括削除メニューのオープンフラグ
  const handleBulkOpsClose = useCallback(() => { // 一括削除メニューを閉じる処理
    setBulkOpsEl(null);
    handleClose(); // DTMenuも閉じる
  }, [setBulkOpsEl, handleClose]);
  const handleBulkOpsIconClick = useCallback((event: React.MouseEvent<HTMLElement>) => { // 一括操作押下時の処理
    setBulkOpsEl(event.currentTarget);
  }, [setBulkOpsEl]);
  const handleOnClickDelete = useCallback(() => { // 一括削除押下時の処理
    handleBulkOpsClose();
    onClickDelete();
  }, [onClickDelete, handleBulkOpsClose]);

  return (
    <section className={className}>
      <TableCheckBox
        className={styles['table-check-box']}
        headers={headers}
        rows={rows}
        open={open}
        dtMenuRender={(
          <DtMenu
            handleOnClickCreate={handleOnClickCreate}
            handleBulkOpsIconClick={handleBulkOpsIconClick}
            bulkOpsEl={bulkOpsEl}
            handleBulkOpsClose={handleBulkOpsClose}
            handleOnClickDelete={handleOnClickDelete}
          />
        )}
        onMenuIconClick={handleMenuIconClick}
        onMenuClose={handleClose}
        onClickSortIcon={handleOnClickSortIcon}
        loading={loading}
        checkAll={checkAll}
        onCheckAll={onCheckAll}
        checkedIds={checkedIds}
        onCheck={onCheck}
      />
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

type DtMenuProps = {
  handleOnClickCreate: () => void,
  handleBulkOpsIconClick: (event: React.MouseEvent<HTMLElement>) => void,
  bulkOpsEl: null | HTMLElement,
  handleBulkOpsClose: () => void,
  handleOnClickDelete: () => void
}
const DtMenu = memo(({
  handleOnClickCreate,
  handleBulkOpsIconClick,
  bulkOpsEl,
  handleBulkOpsClose,
  handleOnClickDelete
}: DtMenuProps) => (
  <div>
    <MenuItem onClick={handleOnClickCreate}>
      新規追加
    </MenuItem>
    <MenuItem
      onClick={handleBulkOpsIconClick}
    >
      一括操作
    </MenuItem>
    <Menu
      anchorEl={bulkOpsEl}
      open={Boolean(bulkOpsEl)}
      onClose={handleBulkOpsClose}
      placement='left-start'
    >
      <MenuItem onClick={handleOnClickDelete}>
        一括削除
      </MenuItem>
    </Menu>
  </div>
));

DtMenu.displayName = 'DtMenu';