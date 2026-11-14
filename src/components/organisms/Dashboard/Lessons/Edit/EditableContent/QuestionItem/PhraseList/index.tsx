import { OrderedSentences } from "ApiDataTypes";
import { memo, useCallback, useMemo, useState } from "react";
import styles from './styles.module.scss';
import TableCheckBox from '@/components/molecules/Table/DataTable/CheckBox';
import Menu from "@/components/molecules/Menu";
import MenuItem from "@/components/molecules/Menu/Item";
import Button from "@/components/atoms/Button";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

type CheckId = (number | string)

export type Props = {
  className?: string,
  listData: OrderedSentences['phrases'],
  onClickCreate: () => void,
  onClickDelete: () => void,
  onClickUpdate: () => void,
  checkAll: boolean,
  onCheckAll: () => void,
  checkedIds: number[],
  onCheck: (id: CheckId) => void,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

type TblHeaders = {
  label: string,
}[]
const INIT_TBL_HEADERS: TblHeaders = [
  {
    label: 'QS_PHR_ID',
  },
  {
    label: 'EN',
  },
  {
    label: 'JP',
  },
];

const PhraseList = memo((
  {
    className,
    listData,
    onClickCreate,
    onClickUpdate,
    onClickDelete,
    checkAll,
    onCheckAll,
    checkedIds,
    onCheck,
    ...props
  }: Props
) => {
  const rows = useMemo(() => ( // テーブルボディデータの作成
    listData.map(data => (
      {
        checkId: data.qs_ph_id,
        fields: [
          {
            value: data.qs_ph_id,
          },
          {
            value: data.en,
          },
          {
            value: data.jp,
          },
        ]
      }
    ))
  ), [listData]);

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
  const handleOnClickUpdate = useCallback(() => {
    handleClose();
    onClickUpdate();
  }, [handleClose, onClickUpdate]);

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
    <div className={className} {...props}>
      <TableCheckBox
        className={styles['table-check-box']}
        headers={INIT_TBL_HEADERS}
        rows={rows}
        open={open}
        dtMenuRender={(
          <DtMenu
            handleOnClickCreate={handleOnClickCreate}
            handleOnClickUpdate={handleOnClickUpdate}
            handleBulkOpsIconClick={handleBulkOpsIconClick}
            bulkOpsEl={bulkOpsEl}
            handleBulkOpsClose={handleBulkOpsClose}
            handleOnClickDelete={handleOnClickDelete}
            disableUpdate={checkedIds.length !== 1}
          />
        )}
        onMenuIconClick={handleMenuIconClick}
        onMenuClose={handleClose}
        loading={false}
        checkAll={checkAll}
        onCheckAll={onCheckAll}
        checkedIds={checkedIds}
        onCheck={onCheck}
        menuIconRender={(
          <Button
            variant="text"
            endIcon={<KeyboardArrowDownIcon />}
          >
            Options
          </Button>
        )}
      />
    </div>
  );
});
PhraseList.displayName = 'PhraseList';
export default PhraseList;

type DtMenuProps = {
  handleOnClickCreate: () => void,
  handleOnClickUpdate: () => void,
  handleBulkOpsIconClick: (event: React.MouseEvent<HTMLElement>) => void,
  bulkOpsEl: null | HTMLElement,
  handleBulkOpsClose: () => void,
  handleOnClickDelete: () => void,
  disableUpdate: boolean,
}
const DtMenu = memo(({
  handleOnClickCreate,
  handleOnClickUpdate,
  handleBulkOpsIconClick,
  bulkOpsEl,
  handleBulkOpsClose,
  handleOnClickDelete,
  disableUpdate,
}: DtMenuProps) => (
  <div>
    <MenuItem onClick={handleOnClickCreate}>
      新規追加
    </MenuItem>
    <MenuItem onClick={handleOnClickUpdate} disabled={disableUpdate}>
      編集
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