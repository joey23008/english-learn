import React, { forwardRef, memo } from 'react';
import Link from 'next/link';
import Checkbox from '@mui/material/Checkbox';
import classNames from 'classnames';
import DTMenu from '@/components/molecules/Table/DataTable/Basic/DTMenu';
import DT from '@/components/molecules/Table/DataTable/Basic/DT';
import DThead from '@/components/molecules/Table/DataTable/Basic/DThead';
import DTbody from '@/components/molecules/Table/DataTable/Basic/DTbody';
import DTr from '@/components/molecules/Table/DataTable/Basic/DTr';
import DTh from '@/components/molecules/Table/DataTable/Basic/DTh';
import DTd from '@/components/molecules/Table/DataTable/Basic/DTd';
import type { BasicDThProps } from '@/components/molecules/Table/DataTable/Basic/DTh';
import CircularProgress from '@/components/molecules/Progress/Circular';

type Field = {
  value: number | string,
  link?: string,
}

type Row = {
  checkId: number | string,
  fields: Field[],
}

type Header = {
  sort?: BasicDThProps['sort'],
  label: string,
}

export type Props = {
  className?: string,
  headers: Header[],
  rows: Row[],
  open: boolean,
  dtMenuRender: React.ReactNode,
  onMenuClose: (event: object, reason: string) => void,
  onMenuIconClick: () => void,
  onClickSortIcon?: BasicDThProps['onClick'],
  loading: boolean,
  checkAll: boolean,
  onCheckAll: () => void,
  checkedIds: Row['checkId'][],
  onCheck: (id: Row['checkId']) => void,
  menuIconRender?: React.ReactNode,
}

const Table = memo(forwardRef(
  (
    {
      className,
      headers,
      rows,
      open,
      dtMenuRender,
      onMenuIconClick,
      onMenuClose,
      onClickSortIcon,
      loading,
      checkAll,
      onCheckAll,
      checkedIds,
      onCheck,
      menuIconRender,
      ...props
    }: Props, ref: React.ForwardedRef<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => {
  const classes = classNames(className);

  return (
    <section className={classes}>
      <DTMenu
        open={open}
        onMenuIconClick={onMenuIconClick}
        onClose={onMenuClose}
        menuIconRender={menuIconRender}
      >
        {dtMenuRender}
      </DTMenu>
      <DT
        className="checkbox-table-area"
        ref={ref}
        {...props}
      >
        <DThead>
          <DTr>
            <DTh>
              <Checkbox
                checked={checkAll}
                onChange={onCheckAll}
                name="checkAll"
                sx={{
                  padding: 0
                }}
              />
            </DTh>
            {
              headers.map(h => (
                <DTh
                  key={h.label}
                  sort={h.sort}
                  onClick={(id, sort) => onClickSortIcon ? onClickSortIcon(id, sort) : null}
                >{h.label}</DTh>
              ))
            }
          </DTr>
        </DThead>
        <DTbody>
          {
            !loading ? (
              rows.length > 0 ? rows.map((row) => <GetRow key={row.checkId} row={row} checked={checkedIds.includes(row.checkId)} onCheck={onCheck} />) :
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
    </section>
  );
}));
Table.displayName = 'TableCheckBox';

export default Table;

const GetRow = memo(({row, checked, onCheck}: { row: Row, checked: boolean, onCheck: (id: Row['checkId']) => void}) => {
  return (
    (
      <DTr key={row.checkId}>
        <DTd>
          <Checkbox
            checked={checked}
            onChange={() => onCheck(row.checkId)}
            name="checkRow"
            sx={{
              padding: 0
            }}
          />
        </DTd>
        {
          row.fields.map((v, idx) => (
            <DTd key={`${row.checkId}-${idx}`}>
              {
                v.link ? (
                  <Link href={v.link}>{v.value}</Link>
                ) : v.value
              }
            </DTd>
          ))
        }
      </DTr>
    )
  );
});
GetRow.displayName = 'GetRow';