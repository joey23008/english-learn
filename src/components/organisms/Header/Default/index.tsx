import { memo, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import useSession from '@/hooks/useSession';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Tooltip from '@mui/material/Tooltip';
import Menu from "@/components/molecules/Menu";
import MenuItem from "@/components/molecules/Menu/Item";
import { URL, SITE_TITLE } from '@/consts';
import styles from './styles.module.scss';
import variables from '@/components/_variables.module.scss';
import LinearProgress from '@/components/molecules/Progress/Linear';
import { useGlobalProgress } from '@/hooks/useGlobalProgress';
import { useAuth } from '@/hooks/useAuth';
import { useError } from '@/hooks/useError';

const Header = memo(() => {
  const router = useRouter();
  const { logout } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const me = useSession();
  const { globalProgress } = useGlobalProgress();
  const { setError } = useError();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(anchorElUser ? null : event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onLogout = useCallback(async () => {
    try {
      await logout();
      return router.push(URL.LOGIN);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(err);
    }
  }, [router, logout, setError]);

  const onSignUp = useCallback(async () => {
    router.push(URL.SIGNUP);
  }, [router]);

  return (
    <>
      <AppBar position="static" id={styles.header}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: `${variables['h_header']}px`}}>
            <div id={styles['site-logo']}>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href={URL.HOME}
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                {SITE_TITLE}
              </Typography>
            </div>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, color: 'inherit' }}>
                  <AccountCircle />
                </IconButton>
              </Tooltip>
              <Menu
                id={styles['menu-appbar']}
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                placement='bottom-start'
              >
                <MenuItem onClick={onSignUp}>
                  <Typography sx={{ textAlign: 'center' }}>サインアップ</Typography>
                </MenuItem>
                <MenuItem onClick={onLogout}>
                  <Typography sx={{ textAlign: 'center' }}>ログアウト</Typography>
                </MenuItem>
              </Menu>
            </Box>
            <Box id={styles['user-name']}>{me?.name ?? null}</Box>
          </Toolbar>
        </Container>
        {
          globalProgress ? (
            <LinearProgress
              color="inherit"
              sx={{
                height: '2px',
              }}
            />
          ) : null
        }
      </AppBar>
    </>
  );
});

Header.displayName = 'Header';
export default Header;