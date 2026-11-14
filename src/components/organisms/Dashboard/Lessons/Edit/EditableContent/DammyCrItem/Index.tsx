import { memo } from "react";
import { EL_TYPE, TYPE_CHAP_IDX } from "../Insert/Menu";
import classNames from "classnames";
import { SubmitHandler, useForm } from "react-hook-form";
import { noCtrlChar } from "@/utils";
import { ErrorTxt } from "@/components/atoms/Txt";
import SubmitOnEnter from "@/components/atoms/TextField/SubmitOnEnter";

type Data = {
  type: (typeof EL_TYPE)[number],
  number: number,
  parent: number | null,
}

export type OnSubmitParams = {
  value: string
} & Data

type Props = {
  className?: string,
  data: Data,
  onSubmit: (params: OnSubmitParams) => void,
  // loading: boolean,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

type FormValues = {
  name: string,
}

const DammyCrItem = memo(({ className, data, onSubmit, ...props}: Props) => {
  const { handleSubmit, register, formState: { errors } } = useForm<FormValues>({ shouldFocusError: false });

  // 登録時の処理
  const handleOnSubmit: SubmitHandler<FormValues> = async (inputData) => {
    onSubmit({
      ...data,
      value: inputData.name,
    });
  };

  const placeholder = `${data.type === EL_TYPE[TYPE_CHAP_IDX] ? 'チャプター' : 'クエスチョン'}名を入力`;

  return (
    <div className={classNames(className)} {...props}>
      <SubmitOnEnter
        {
          ...register("name", {
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
        onBlur={handleSubmit(handleOnSubmit)}
        placeholder={placeholder}
        // disabled={loading}
        onSubmit={handleSubmit(handleOnSubmit)}
      />
      {
        errors?.name?.type === 'maxLength' && <ErrorTxt className='mt-[5px]' size='s'>255文字以下で入力してください。</ErrorTxt>
      }
      {
        errors?.name?.type === 'noCtrlChar' && <ErrorTxt className='mt-[5px]' size='s'>非制御文字のみ入力して下さい。</ErrorTxt>
      }
    </div>
  );
});
DammyCrItem.displayName = 'DammyCrItem';
export default DammyCrItem;