import { memo } from 'react';
import Header from '@/components/organisms/Header/Default';
import SidebarDashboard from '@/components/organisms/Sidebar/Dashboard';
import SidebarFrontend from '@/components/organisms/Sidebar/Frontend';
import { PAGE_TYPES, IDX_DASH_PAGE } from '@/consts';
import styles from './styles.module.scss';

type Props = {
  pageType: typeof PAGE_TYPES[number],
  children: React.ReactNode,
}

const Dashboard = memo(({ pageType, children }: Props) => {
  return (
    <section>
      <section id={styles.header} >
        <Header />
      </section>
      <section className={styles.wrapper}>
        {
          pageType === PAGE_TYPES[IDX_DASH_PAGE] ? (
            <SidebarDashboard id={styles.sidebar} />
          ) : (
            <SidebarFrontend id={styles.sidebar} />
          )
        }
        <section id={styles.content}>
          {children}
        </section>
      </section>
    </section>
  );
});
Dashboard.displayName = 'LayoutDashboard';
export default Dashboard;
