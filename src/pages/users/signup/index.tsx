import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
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
import styles from './styles.module.scss';
import { noCtrlChar } from '@/utils';
import { Regex, SITE_TITLE, URL } from '@/consts';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

type FormValues = {
  name: string,
  email: string,
  password: string,
};

const SignUp: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const { signup, getCount } = useAuth();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await signup(data);
    return router.push(URL.HOME);
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
  };

  const isUniqueEmail = async (v: string) => {
    const { count } = await getCount({ email: v });
    return count === 0;
  };

  return (
    <>
      <Head>
        <title>{`${SITE_TITLE} | サインアップ`}</title>
      </Head>
      <section id={styles['signup-page']}>
        <Txt
          tag='h1'
          size='l'
          className='mb-[10px]'
        >
          サインアップ
        </Txt>
        <Card>
          <CardContent>
            <Txt
              tag='label'
              htmlFor='name'
              className='mb-[5px]'
            >
              ユーザー名
            </Txt>
            <div>
              <TextField
                {
                    ...register("name", {
                        required: true,
                        maxLength: 255,
                        validate: {
                          noCtrlChar: v => noCtrlChar(v)
                        },
                    })
                }
                id='name'
                className='w-full'
                variant='outlined'
                error={Boolean(errors.name)}
              />
            </div>
            {
              errors?.name?.type === 'required' && <ErrorTxt className='mt-[5px]' size='s'>値の入力は必須です。</ErrorTxt>
            }
            {
              errors?.name?.type === 'maxLength' && <ErrorTxt className='mt-[5px]' size='s'>255文字以下で入力してください。</ErrorTxt>
            }
            {
              errors?.name?.type === 'noCtrlChar' && <ErrorTxt className='mt-[5px]' size='s'>非制御文字のみ入力して下さい。</ErrorTxt>
            }
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
                        pattern: Regex.EMAIL,
                        validate: {
                          unique: isUniqueEmail,
                        }
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
            {
              errors?.email?.type === 'pattern' && <ErrorTxt className='mt-[5px]' size='s'>形式が正しくありません。</ErrorTxt>
            }
            {
              errors?.email?.type === 'unique' && <ErrorTxt className='mt-[5px]' size='s'>既に登録されています。</ErrorTxt>
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
                        pattern: Regex.PASS,
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
            {
              errors?.password?.type === 'pattern' && <ErrorTxt className='mt-[5px]' size='s'>形式が正しくありません。8文字以上16文字以下の半角英数字あるいは&ldquo;.-_@&ldquo;の記号のみ使用できます。</ErrorTxt>
            }
          </CardContent>
          <CardActions className='justify-end'>
            <Button
              variant='contained'
              onClick={handleSubmit(onSubmit)}
            >登録</Button>
          </CardActions>
        </Card>
        <Txt className='text-right mt-[10px]'>
          <Link href={URL.HOME}>ホーム</Link>
        </Txt>
      </section>
    </>
  );
};

export default SignUp;
