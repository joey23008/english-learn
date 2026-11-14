import { Sentence } from "ApiDataTypes";
import { memo, useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { noCtrlChar } from "@/utils";
import Row, { ErrorRow, HeaderRow } from "@/components/molecules/FormLayout/Row";
import Col from "@/components/molecules/FormLayout/Col";
import classNames from "classnames";
import SubmitOnEnter from "@/components/atoms/Textarea/SubmitOnEnter/Index";
import type { OnUpdateSentenceParams } from "@/pages/dashboard/lessons/[id]";
import { MSG_ERR } from "@/consts";
import { ErrorTxt } from "@/components/atoms/Txt";
import { useMouseHover } from "@/hooks/useMouseHover";
import DeleteIcon from '@mui/icons-material/Delete';
import styled from './styles.module.scss';

type Props = {
  className?: string,
  data: Sentence,
  onUpdate: (params: OnUpdateSentenceParams) => void,
  onDelete: () => void,
  focusOnMounted?: boolean,
  loading: boolean,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

type FormValues = {
  content: string,
  answer: string,
};

const SentenceItem = memo((
  {
    className,
    data: { id, content, answer },
    onUpdate,
    onDelete,
    focusOnMounted=false,
    loading,
    ...props
  }: Props
) => {
  const { ref: hoverRef, isHover } = useMouseHover();
  const { handleSubmit, formState: { errors }, setValue, control } = useForm<FormValues>({
    shouldFocusError: false,
    defaultValues: {
      content,
      answer,
    }
  });
  const [focusOnMountedDone, setFocusOnMountedDone] = useState(false);

  const handleOnSubmit = useCallback((data: FormValues) => {
    if (data.content !== content || data.answer !== answer) {
      onUpdate({
        ...data,
        id,
      });
    }
  }, [onUpdate, id, content, answer]);

  return (
    <div
      className={
        classNames(
          className,
          'card p-[20px] relative'
        )
      }
      ref={hoverRef}
      {...props}
    >
      {
        isHover && !loading ? <DeleteIcon className={styled['delete-ico']} onClick={onDelete} /> : null
      }
      <HeaderRow style={{ marginTop: 0 }}>
        <Col>
          <label htmlFor="content">問題</label>
        </Col>
      </HeaderRow>
      <Row>
        <Col>
          <Controller
            control={control}
            name="content"
            rules={{
              validate: {
                noCtrlChar: v => noCtrlChar(v)
              },
            }}
            render={({
              field: { value, ref },
            }) => {
              const setRef = (node: HTMLTextAreaElement | null) => {
                if (node) {
                  ref(node);
                  if (focusOnMounted && !focusOnMountedDone) {
                    node.focus();
                    setFocusOnMountedDone(true);
                  }
                }
              };
              return (
                <SubmitOnEnter
                  value={value}
                  onInput={(e: React.FormEvent<HTMLTextAreaElement>) => setValue('content', (e.target as HTMLTextAreaElement).value)}
                  id="content"
                  onSubmit={handleSubmit(handleOnSubmit)}
                  onBlur={handleSubmit(handleOnSubmit)}
                  error={Boolean(errors.content)}
                  ref={setRef}
                />
              );
            }}
          />
        </Col>
      </Row>
      {
        errors.content ? (
          <ErrorRow>
            <Col>
              {
                errors?.content?.type === 'noCtrlChar' && <ErrorTxt size='s'>{MSG_ERR.NO_CTRL_CHAR}</ErrorTxt>
              }
            </Col>
          </ErrorRow>
        ) : null
      }
      <HeaderRow>
        <Col>
          <label htmlFor="answer">解答</label>
        </Col>
      </HeaderRow>
      <Row>
        <Col>
          <Controller
            control={control}
            name="answer"
            rules={{
              validate: {
                noCtrlChar: v => noCtrlChar(v)
              },
            }}
            render={({
              field: { value, ref },
            }) => {
              return (
                <SubmitOnEnter
                  value={value}
                  onInput={(e: React.FormEvent<HTMLTextAreaElement>) => setValue('answer', (e.target as HTMLTextAreaElement).value)}
                  id="answer"
                  onSubmit={handleSubmit(handleOnSubmit)}
                  onBlur={handleSubmit(handleOnSubmit)}
                  error={Boolean(errors.answer)}
                  ref={ref}
                />
              );
            }}
          />
        </Col>
      </Row>
      {
        errors.answer ? (
          <ErrorRow>
            <Col>
              {
                errors?.answer?.type === 'noCtrlChar' && <ErrorTxt size='s'>{MSG_ERR.NO_CTRL_CHAR}</ErrorTxt>
              }
            </Col>
          </ErrorRow>
        ) : null
      }
    </div>
  );
});
SentenceItem.displayName = 'SentenceItem';
export default SentenceItem;