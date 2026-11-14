import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useForm, SubmitHandler } from 'react-hook-form';
import { SITE_TITLE, STATUS, URL } from '@/consts';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Txt, { ErrorTxt } from '@/components/atoms/Txt';
import TextField from '@/components/atoms/TextField';
import Button from '@/components/atoms/Button';
import Alert from '@/components/atoms/Alert';
import styles from './styles.module.scss';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useError } from '@/hooks/useError';

type FormValues = {
  email: string,
  password: string,
};

const Login: NextPage = () => {
  const router = useRouter();
  const { setError } = useError();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [alert, setAlert] = useState(false);
  const prevPath = typeof router.query['prev-path'] === 'string' ? router.query['prev-path'] : undefined;

  useEffect(() => {
    if (typeof window !== 'undefined' && Cookies.get('logged-in')) {
      router.push(URL.HOME);
    }
  }, [router]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setAlert(false);
      await login(data);
      return router.push(prevPath ? prevPath : URL.HOME);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (err.status === STATUS.BAD_REQUEST) {
        setAlert(true);
      } else {
        setError(err);
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
  };

  return (
    <>
      <Head>
        <title>{`${SITE_TITLE} | ログイン`}</title>
      </Head>
      <section id={styles['login-page']}>
        <Txt
          tag='h1'
          size='l'
          className='mb-[10px]'
        >
          ログイン
        </Txt>
        <Card>
          <CardContent>
            { alert ? <Alert severity="error">Eメールあるいはパスワードが正しくありません。</Alert> : null }
            <Txt
              tag='label'
              htmlFor='email'
              className='mb-[5px] mt-[10px]'
            >
              Eメール
            </Txt>
            <div>
              <TextField
                {
                    ...register("email", {
                        required: true,
                    })
                }
                id='email'
                className='w-full'
                variant='outlined'
                error={Boolean(errors.email)}
              />
            </div>
            {
              errors?.email?.type === 'required' && <ErrorTxt className='mt-[5px]' size='s'>値の入力は必須です。</ErrorTxt>
            }
            <Txt
              tag='label'
              htmlFor='password'
              className='mb-[5px] mt-[10px]'
            >
              パスワード
            </Txt>
            <div>
              <TextField
                {
                    ...register("password", {
                        required: true,
                    })
                }
                id='password'
                className='w-full'
                variant='outlined'
                error={Boolean(errors.password)}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                    endAdornment: <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }}
              />
            </div>
            {
              errors?.password?.type === 'required' && <ErrorTxt className='mt-[5px]' size='s'>値の入力は必須です。</ErrorTxt>
            }
          </CardContent>
          <CardActions className='justify-end'>
            <Button
              variant='contained'
              onClick={handleSubmit(onSubmit)}
            >ログイン</Button>
          </CardActions>
        </Card>
        <Txt className='text-right mt-[10px]'>
          <Link href={URL.SIGNUP}>サインアップ</Link>
        </Txt>
      </section>
    </>
  );
};

export default Login;
