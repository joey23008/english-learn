import { Phrase } from "ApiDataTypes";
import { memo } from "react";
import styles from './styles.module.scss';
import Chip from "@/components/molecules/Chip";
import classNames from "classnames";

type Props = {
  className?: string,
  data: Phrase,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const PhraseItem = memo((
  {
    className,
    data: { en, jp },
    ...props
  }: Props
) => {
  return (
    <Chip
      className={classNames(styles['phrase-item'], className)}
      {...props}
    >
      <div>{en}</div>
      <div>「{jp}」</div>
    </Chip>
  );
});
PhraseItem.displayName = 'PhraseItem';
export default PhraseItem;