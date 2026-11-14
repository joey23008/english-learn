import { memo } from 'react';
import List from '@/components/molecules/List/Base/Index';
import ListItem from '@/components/molecules/List/Base/ListItem/Index';
import Link from 'next/link';
import classNames from 'classnames';
import sidebarStyles from '../styles.module.scss';
import PageTypeChip from '../../PageTypeChip';
import { IDX_FRONT_PAGE, PAGE_TYPES } from '@/consts';

type Props = {
  className?: string,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Sidebar = memo(({ className, ...props }: Props) => {
  return (
    <section className={classNames(className, sidebarStyles.sidebar)} {...props}>
      <PageTypeChip pageType={PAGE_TYPES[IDX_FRONT_PAGE]} className='mb-[3px]' />
      <List>
        <ListItem style={{ padding: 0 }}>
          <Link href="/frontend/lessons" className='block' style={{ padding: '5px 0'}}>レッスン一覧</Link>
        </ListItem>
      </List>
    </section>
  );
});
Sidebar.displayName = 'SidebarFrontend';
export default Sidebar;
